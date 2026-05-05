--------------- ### THIS IS FOR SUPABASE ONLY
--------------- ### copy these code to run on supabase sql query

CREATE OR REPLACE FUNCTION update_profile(
  param_users_id uuid,
  param_settings jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  tz text;
BEGIN
  tz := param_settings->>'timezone';

  IF tz IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_timezone_names 
      WHERE name = tz
    ) THEN
      RAISE EXCEPTION 'Invalid timezone';
    END IF;
  END IF;

  -- Update
  UPDATE profiles
  SET 
    settings = param_settings,
    updatedat = NOW()
  WHERE id = param_users_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;
END;
$$;





-- vv this fix the count days/months (30,31, 28,29) mismatch problem but add problem about
--    search at 30 Dec will only show THAT year, not next year
-- param_ahead_days <= 31 THEN day
-- param_ahead_days > 31 && param_ahead_days <= 366 THEN month(12)
-- param_ahead_days > 366 THEN year
-- # NOTE: QUITE A BAD DESIGN I THINK, USING AHEAD_DAYS MIGHT BE A MISTAKE, yabai
CREATE OR REPLACE FUNCTION get_due_distribution_by_date(
  param_decks_id uuid,
  param_users_id uuid,
  param_timezone text,
  param_ahead_days integer
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  startdate date;
  enddate date;
  utc_start timestamptz;
  utc_end timestamptz;
  safe_aheaddays integer;
  
  tmp_card_nextdue json;
  tmp_card_overdue_count json;

  group_unit text;
BEGIN

  -- Permission check
  PERFORM 1 
  FROM decks 
  WHERE id = param_decks_id 
    AND users_id = param_users_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;

  safe_aheaddays := COALESCE(param_ahead_days, 7);

  startdate := (NOW() AT TIME ZONE param_timezone)::date;

  group_unit := CASE
    WHEN safe_aheaddays <= 30  THEN 'day'
    WHEN safe_aheaddays <= 366 THEN 'month'
    ELSE 'year'
  END;

  -- NORMAL DAY RANGE
  IF group_unit = 'day' THEN
    enddate := startdate + safe_aheaddays;

  -- bascially start the at the first day of THAT YEAR to the last day of THAT YEAR
  ELSIF group_unit = 'month' THEN
    startdate := date_trunc('year', startdate)::date;
    enddate := (startdate + INTERVAL '1 year - 1 day')::date;

  -- bascially start the at the first day of THAT YEAR to the last day of THAT 5th YEAR
  ELSE
    startdate := date_trunc('year', startdate)::date;
    enddate := (startdate + INTERVAL '5 year')::date; -- arbitrary range
  END IF;

  -- Overdue cards
  SELECT count(*) 
  INTO tmp_card_overdue_count
  FROM cards
  WHERE decks_id = param_decks_id 
    AND status = 1 
    AND (due AT TIME ZONE param_timezone)::date < startdate
  ;


  -- Next due cards
  utc_start := startdate AT TIME ZONE param_timezone;
  utc_end := (enddate + 1) AT TIME ZONE param_timezone;

  WITH 
    genseries AS (
      SELECT generate_series(
        date_trunc(group_unit, startdate),
        date_trunc(group_unit, enddate),
        ('1 ' || group_unit)::interval
      )::date AS bucket
    ),

    cards_count AS (
      SELECT 
        date_trunc(group_unit, (due AT TIME ZONE param_timezone))::date AS bucket,
        COUNT(*) AS total
      FROM cards
      WHERE decks_id = param_decks_id
        AND status = 1 
        AND (due AT TIME ZONE param_timezone)::date >= startdate
        AND (due AT TIME ZONE param_timezone)::date <= enddate
      GROUP BY 1
    ),

    result AS (
      SELECT 
        CASE 
          WHEN group_unit = 'day'   THEN to_char(genseries.bucket, 'YYYY-MM-DD')
          WHEN group_unit = 'month' THEN to_char(genseries.bucket, 'YYYY-MM')
          ELSE to_char(genseries.bucket, 'YYYY')
        END AS date,
        COALESCE(cards_count.total, 0) AS count
      FROM genseries
      LEFT JOIN cards_count 
        ON genseries.bucket = cards_count.bucket
      ORDER BY genseries.bucket
    )

  SELECT json_agg(result)
  INTO tmp_card_nextdue
  FROM result;


  RETURN json_build_object(
    'dues', tmp_card_nextdue,
    'overdues_count', tmp_card_overdue_count
  );

END
$$;





CREATE OR REPLACE FUNCTION get_cards(
  param_decks_id uuid,
  param_users_id uuid,
  param_searchtext text,
  param_sortby text,
  param_sortby_direction text,
  param_offset integer DEFAULT 0,
  param_limit integer DEFAULT 20
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  tmp_count integer;
  tmp_cards json;

BEGIN
  -- IF param_sortby NOT IN ('id', 'status', 'due', 'interval', 'easefactor', 'repetition', 'createdat', 'updatedat') THEN
  --   RAISE EXCEPTION 'Invalid sortby';
  -- END IF;

  IF UPPER(param_sortby_direction) NOT IN ('ASC', 'DESC') THEN
    RAISE EXCEPTION 'Invalid sortby direction';
  END IF;


  -- Permission check
  PERFORM 1
  FROM decks
  WHERE id = param_decks_id
    AND users_id = param_users_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;


  SELECT count(*) INTO tmp_count 
  FROM cards 
  WHERE decks_id = param_decks_id AND data::text ILIKE '%' || param_searchtext || '%';


  -- %L -> literal 'string' stuff with double quote, %I -> identifier table name scheme column name stuff, %s -> simple string insert as is
  EXECUTE format('
    SELECT jsonb_agg(t) FROM (
      SELECT * FROM cards
      WHERE decks_id = %L 
      AND data::text ILIKE %L
      ORDER BY %I %s
      LIMIT %L OFFSET %L
    ) t',
    param_decks_id, '%' || param_searchtext || '%', param_sortby, 
    param_sortby_direction, param_limit, param_offset
  ) INTO tmp_cards;


  RETURN jsonb_build_object(
    'total', tmp_count,
    'data', coalesce(tmp_cards, '[]'::json)
  );
END;
$$;





CREATE OR REPLACE FUNCTION get_retention_rate_by_date(
  param_decks_id uuid,
  param_users_id uuid,
  param_timezone text,
  param_from_date date,
  param_to_date date
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  local_today date;
  final_from date;
  final_to date;
  result_json json;
BEGIN
  -- 1. Check Permission
  PERFORM 1 
  FROM decks 
  WHERE id = param_decks_id AND users_id = param_users_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;

  -- 2. Determine Local "Today" relative to the user's timezone
  local_today := (NOW() AT TIME ZONE param_timezone)::date;
  
  -- 3. Set the date boundaries
  final_from := COALESCE(param_from_date, local_today);
  final_to   := COALESCE(param_to_date, local_today);

  -- 4. Calculate stats
  -- We wrap the query to ensure we only count the FIRST review per card per day
  SELECT json_build_object(
    'from', final_from,
    'to', final_to,
    'passed', COUNT(*) FILTER (WHERE quality >= 3),
    'failed', COUNT(*) FILTER (WHERE quality < 3),
    'total', COUNT(*)
  )
  INTO result_json
  FROM (
    SELECT DISTINCT ON (
      reviews.cards_id, 
      (reviews.createdat AT TIME ZONE param_timezone)::date
    )
      reviews.quality
    FROM reviews
    JOIN cards ON reviews.cards_id = cards.id
    WHERE cards.decks_id = param_decks_id
      -- THE FIX: Shift UTC storage to Local Time before checking the date
      -- This stops the 7-hour "Bangkok vs UTC" overlap
      AND (reviews.createdat AT TIME ZONE param_timezone)::date >= final_from
      AND (reviews.createdat AT TIME ZONE param_timezone)::date <= final_to
    ORDER BY 
      reviews.cards_id, 
      (reviews.createdat AT TIME ZONE param_timezone)::date, 
      reviews.createdat ASC
  ) AS daily_first_reviews;

  RETURN result_json;
END;
$$;





CREATE OR REPLACE FUNCTION get_deck_status(
  param_decks_id uuid,
  param_users_id uuid,
  param_timezone text
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  startdate date;
  utc_start timestamptz;
  utc_end timestamptz;
  
  tmp_total_count integer;
  tmp_card_status_count jsonb;
  tmp_card_maturity_count jsonb;
  tmp_card_due_distribution json;
  tmp_review_retention_rate jsonb;
BEGIN
  -- Check Permission
  PERFORM 1 FROM decks WHERE id = param_decks_id AND users_id = param_users_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;


  startdate := (NOW() AT TIME ZONE param_timezone)::date;
  utc_start := startdate AT TIME ZONE param_timezone;
  utc_end := utc_start + INTERVAL '1 day';


  -- Total cards
  SELECT count(*) INTO tmp_total_count FROM cards WHERE decks_id = param_decks_id;


  -- Status distribution
  SELECT jsonb_build_object(
    'new', count(*) FILTER (WHERE status = 0),
    'due', count(*) FILTER (WHERE status = 1),
    'retry', count(*) FILTER (WHERE status = 2)
  ) 
  INTO tmp_card_status_count 
  FROM cards 
  WHERE decks_id = param_decks_id;


  -- Maturity distribution 
  SELECT jsonb_build_object(
    'unseen', count(*) FILTER (WHERE status = 0 AND interval = 0),
    'learning', count(*) FILTER (WHERE status != 0 AND interval < 15),
    'young', count(*) FILTER (WHERE interval >= 15 AND interval < 61),
    'mature', count(*) FILTER (WHERE interval >= 61 AND interval < 365),
    'master', count(*) FILTER (WHERE interval >= 365)
  ) 
  INTO tmp_card_maturity_count 
  FROM cards 
  WHERE decks_id = param_decks_id;


  -- Due Distribution (default = 7)
  tmp_card_due_distribution := get_due_distribution_by_date(
    param_decks_id,
    param_users_id,
    param_timezone,
    7
  );


  -- Retention rate (Today's local day only)
  tmp_review_retention_rate := get_retention_rate_by_date(
    param_decks_id,
    param_users_id,
    param_timezone,
    param_from_date := NULL,
    param_to_date := NULL
  );


  
  RETURN json_build_object(
    'date', startdate,
    'cards_status_distribution', tmp_card_status_count,
    'cards_maturity_distribution', tmp_card_maturity_count,
    'cards_due_distribution', tmp_card_due_distribution,
    'review_retention_rate', tmp_review_retention_rate,
    'cards_total', tmp_total_count
  );
END;
$$;





CREATE OR REPLACE FUNCTION update_card(
  param_decks_id uuid,
  param_cards_id uuid,
  param_users_id uuid,
  param_updates jsonb
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  updated_row json;
  
BEGIN
  -- Check Permission and if card exist in the deck???
  IF NOT EXISTS (
    SELECT 1 FROM cards c
    JOIN decks d ON d.id = c.decks_id
    WHERE d.id = param_decks_id 
      AND d.users_id = param_users_id
      AND c.id = param_cards_id
  ) THEN
    RAISE EXCEPTION USING 
      MESSAGE = 'Unauthorized or Card not found', 
      ERRCODE = '42501';
  END IF;

  -- ACTUAL UPDATE
  UPDATE cards c
  SET 
    data = c.data || (param_updates->'data'),
    updatedat = NOW()
  WHERE c.id = param_cards_id 
    AND c.decks_id = param_decks_id
  RETURNING row_to_json(c) INTO updated_row;

  RETURN updated_row;
END;
$$;





CREATE OR REPLACE FUNCTION get_decks_with_card_counts(
    param_users_id uuid,
    param_timezone text,
    param_searchtext text,
    param_sortby text,
    param_sortby_direction text,
    param_offset integer DEFAULT 0,
    param_limit integer DEFAULT 20
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    startdate date;
    enddate date;
    utc_start timestamptz;
    utc_end timestamptz;

    decks_data json;
    total_deck_count integer;
BEGIN
  -- TIME AND TIMEZONE STUFF
  startdate := (NOW() AT TIME ZONE param_timezone)::date;
  utc_start := startdate AT TIME ZONE param_timezone;
  utc_end := utc_start + INTERVAL '1 day';

  -- validate sortby direction
  IF UPPER(param_sortby_direction) NOT IN ('ASC', 'DESC') THEN
    RAISE EXCEPTION 'Invalid sortby direction';
  END IF;


  -- total deck count
  SELECT COUNT(*)
  INTO total_deck_count
  FROM decks 
  WHERE decks.users_id = param_users_id;


  EXECUTE format(
  'SELECT json_agg(result)
    FROM (
      SELECT
        *,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                ''status'', statuscode.status,
                ''count'', COALESCE(cnt.cnt, 0)
              )
              ORDER BY statuscode.status
            )
            FROM (VALUES (0), (1), (2)) AS statuscode(status)
            LEFT JOIN (
              SELECT cards.status, COUNT(cards.id) AS cnt
              FROM cards
              WHERE cards.decks_id = decks.id
                AND (
                      cards.status = 2
                      -- CHANGE IS HERE: Compare local date of the card to the user''s local date
                      OR (cards.due AT TIME ZONE %L)::date <= %L::date
                    )
              GROUP BY cards.status
            ) cnt
            ON cnt.status = statuscode.status
          ), 
        ''[]''
        ) AS today_dues
      FROM decks
      WHERE decks.users_id = %L
        AND decks.name ILIKE %L
      ORDER BY %I %s
      OFFSET %L
      LIMIT %L
    ) result',
    param_timezone,                -- %L (for AT TIME ZONE)
    startdate,                     -- %L (for comparison)
    param_users_id,                -- %L
    '%' || param_searchtext || '%',-- %L
    param_sortby,                  -- %I
    param_sortby_direction,        -- %s
    param_offset,                  -- %L
    param_limit                    -- %L
  ) INTO decks_data;

  RETURN json_build_object(
      'date', startdate,
      'decks', COALESCE(decks_data, '[]'::json),
      'total_deck_count', total_deck_count
  );
END;
$$;





CREATE OR REPLACE FUNCTION calculate_sm2(
  param_interval integer,
  param_easefactor integer,
  param_repetition integer,
  param_quality integer
)
RETURNS sm2_result
LANGUAGE plpgsql

AS $$
DECLARE
  result sm2_result;

  tmp_interval integer;
  tmp_easefactor numeric;
  tmp_repetition integer;
  tmp_status_code integer;

BEGIN
  IF param_quality < 0 OR param_quality > 5 THEN
    RAISE EXCEPTION USING
      MESSAGE = 'Invalid quality',
      ERRCODE = '22023';
  END IF;

  tmp_easefactor := param_easefactor::numeric / 10;

  tmp_easefactor := tmp_easefactor::numeric 
  + (0.1 - (5 - param_quality)::numeric
  * (0.08 + (5 - param_quality)::numeric * 0.02));

  IF tmp_easefactor < 1.3 THEN
    tmp_easefactor := 1.3;
  ELSIF tmp_easefactor > 2.5 THEN
    tmp_easefactor := 2.5;
  END IF;


  IF param_quality < 3 then
    -- FAILED - RESET 
    tmp_interval := 1;
    tmp_repetition := 0;
    tmp_status_code := 2;    -- 0: new, 1: due, 2: retry

  ELSE
    tmp_repetition := param_repetition + 1;

    -- PASSED
    -- EDIT SOME SM-2 RULES BECAUSE I 'THINK' IT TOO AGGRESSIVE FOR 3rd PASSED (or 2nd rep) TO BE 6 days
    CASE tmp_repetition
      WHEN 1 THEN tmp_interval := 1;
      WHEN 2 THEN tmp_interval := 3;
      WHEN 3 THEN tmp_interval := 7;
      ELSE
        tmp_interval := ROUND(param_interval * tmp_easefactor)::integer;
    END CASE;
  
    tmp_status_code := 1;

  END IF;

  result.interval := tmp_interval;
  result.easefactor := ROUND(tmp_easefactor * 10)::integer;
  result.repetition := tmp_repetition;
  result.status_code := tmp_status_code;

  RETURN result;

END;
$$;





CREATE OR REPLACE FUNCTION update_cards_and_add_review(
  param_decks_id uuid,
  param_cards_id uuid,
  param_users_id uuid,
  param_timespent integer,
  param_quality integer
)
RETURNS json
LANGUAGE plpgsql

AS $$
DECLARE
  status_name text;
  updated_card json;

  tmp_the_card cards%ROWTYPE; 
  tmp_algo_result sm2_result;
  
BEGIN

  IF param_quality < 0 OR param_quality > 5 THEN
    RAISE EXCEPTION USING
      MESSAGE = 'Invalid quality',
      ERRCODE = '22023';
  END IF;

  -- Check Permission
  SELECT cards.*
  INTO tmp_the_card
  FROM cards
  INNER JOIN decks ON decks.id = cards.decks_id
  WHERE decks.id = param_decks_id
    AND decks.users_id = param_users_id
    AND cards.id = param_cards_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      USING MESSAGE = 'Deck not found or access denied',
            ERRCODE = '42501';
  END IF;

  
  -- Calculate new vlaue
  tmp_algo_result := calculate_sm2(
    tmp_the_card.interval, tmp_the_card.easefactor, tmp_the_card.repetition, 
    param_quality
  );
  
  -- Add a review
  INSERT INTO reviews (decks_id, cards_id, timespent, quality)
  VALUES (param_decks_id, param_cards_id, param_timespent, param_quality);

  -- Update THE card
  UPDATE cards c
  SET due = NOW() + (tmp_algo_result.interval || ' days')::interval,
      status = tmp_algo_result.status_code,
      interval = tmp_algo_result.interval,
      easefactor = tmp_algo_result.easefactor,
      repetition = tmp_algo_result.repetition
  WHERE c.decks_id = param_decks_id
    AND c.id = param_cards_id
  RETURNING row_to_json(c) INTO updated_card;


  IF NOT FOUND THEN
  RAISE EXCEPTION
    USING MESSAGE = 'Card not found or update failed',
          ERRCODE = 'NO_DATA_FOUND';
  END IF;


  RETURN updated_card;
END;
$$;





CREATE OR REPLACE FUNCTION get_study_cards_by_status(
  param_decks_id uuid,
  param_users_id uuid,
  param_timezone text,
  param_status_code integer, -- 0=new, 1=due, 2=retry
  param_limit integer DEFAULT 20,
  param_offset integer DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql

AS $$
DECLARE
  startdate date;
  utc_start timestamptz;
  utc_end timestamptz;
  
  status_name text;
  tmp_total_count integer;
  
BEGIN

  status_name :=
    CASE param_status_code
      WHEN 0 THEN 'new'
      WHEN 1 THEN 'due'
      WHEN 2 THEN 'retry'
    END;

  -- Validate Status
  IF status_name IS NULL THEN
    RAISE EXCEPTION USING
      MESSAGE = 'Invalid status',
      ERRCODE = '22023';
  END IF;

  -- Check Permission
  PERFORM 1
  FROM decks
  WHERE id = param_decks_id
    AND users_id = param_users_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      USING MESSAGE = 'Deck not found or access denied',
            ERRCODE = '42501';
  END IF;

  startdate := (NOW() AT TIME ZONE param_timezone)::date;
  utc_start := startdate AT TIME ZONE param_timezone;
  -- utc_end := utc_start + INTERVAL '1 day';

  SELECT count(*) 
  INTO tmp_total_count 
  FROM cards 
  WHERE decks_id = param_decks_id
  AND status = param_status_code
  AND (
        param_status_code = 2
        OR (cards.due AT TIME ZONE param_timezone)::date <= startdate
  );


  -- MAIN --
  RETURN (
    SELECT json_agg(
      json_build_object(
        'status', s.status_name,
        'status_code', param_status_code,
        'items', s.items,
        'offset', param_offset,
        'total', tmp_total_count
      )
    )
    FROM (
      SELECT
      status_name,
      (
        SELECT COALESCE(json_agg(row_to_json(c)), '[]'::json)
        FROM (
          SELECT cards.*
          FROM cards
          WHERE decks_id = param_decks_id
          AND status = param_status_code
          AND (
                param_status_code = 2
                OR cards.due < utc_end
          )
          ORDER BY cards.due ASC
          LIMIT param_limit
          OFFSET param_offset
        ) c
      ) AS items
    ) s
  );
END;
$$;





 CREATE OR REPLACE FUNCTION get_study_cards_initial(
  param_decks_id uuid,
  param_users_id uuid,
  param_timezone text,
  param_new_limit integer DEFAULT 20,
  param_new_offset integer DEFAULT 0,
  param_due_limit integer DEFAULT 20,
  param_due_offset integer DEFAULT 0,
  param_retry_limit integer DEFAULT 20,
  param_retry_offset integer DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql

AS $$
DECLARE
  startdate date;
  utc_start timestamptz;
  utc_end timestamptz;

  result jsonb := '[]'::jsonb;

  const_status_code_arr integer[] := ARRAY[0, 1, 2];
  const_limit_arr integer[] := ARRAY[param_new_limit, param_due_limit, param_retry_limit];
  const_offset_arr integer[] := ARRAY[param_new_offset, param_due_offset, param_retry_offset];
  
  tmp_status_code integer;
  tmp_status_name text;
  tmp_items jsonb;
  tmp_total_count integer;

BEGIN

  -- Check Permission
  PERFORM 1
  FROM decks
  WHERE id = param_decks_id
    AND users_id = param_users_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      USING MESSAGE = 'Deck not found or access denied',
            ERRCODE = '42501';
  END IF;

  startdate := (NOW() AT TIME ZONE param_timezone)::date;
  utc_start := startdate AT TIME ZONE param_timezone;
  -- utc_end := utc_start + INTERVAL '1 day';


  FOREACH tmp_status_code IN ARRAY const_status_code_arr LOOP
    tmp_status_name :=
      CASE tmp_status_code
        WHEN 0 THEN 'new'
        WHEN 1 THEN 'due'
        WHEN 2 THEN 'retry'
      END;

    SELECT COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb)   -- IF THE json_agg() is NULL, RETURN '[]'::json INSTEAD
    INTO tmp_items
    FROM (
      SELECT *
      FROM cards
      WHERE decks_id = param_decks_id
        AND status = tmp_status_code
        AND (
              tmp_status_code = 2
              OR (cards.due AT TIME ZONE param_timezone)::date <= startdate
        )
      ORDER BY due ASC
      LIMIT const_limit_arr[tmp_status_code+1]
      OFFSET const_offset_arr[tmp_status_code+1]
    ) c;

    SELECT count(*)
    INTO tmp_total_count
    FROM cards
    WHERE decks_id = param_decks_id
      AND status = tmp_status_code
      AND (
            tmp_status_code = 2
            OR (cards.due AT TIME ZONE param_timezone)::date <= startdate
      );


    result :=
      result::jsonb || jsonb_build_array(
        jsonb_build_object(
          'status', tmp_status_name,
          'status_code', tmp_status_code,
          'items', tmp_items,
          'total', tmp_total_count,
          'offset', const_offset_arr[tmp_status_code+1]
        )
      );
  END LOOP;

  RETURN result;
END;
$$;






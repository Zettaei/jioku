

-- GetDueDistributionByDate
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

  group_unit text;
  result_json json; -- Match the return type
BEGIN

  -- Check Permission
  PERFORM 1 
  FROM decks 
  WHERE id = param_decks_id 
    AND users_id = param_users_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;


  startdate := (NOW() AT TIME ZONE param_timezone)::date;
  enddate := (startdate + param_ahead_days)::date;
  utc_start := startdate AT TIME ZONE param_timezone;
  utc_end := utc_start + (param_ahead_days * INTERVAL '1 day') ;

  group_unit := CASE
    WHEN param_ahead_days <= 31   THEN 'day'
    WHEN param_ahead_days <= 185  THEN 'week'
    WHEN param_ahead_days <= 366  THEN 'month'
    ELSE 'year'
  END;


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
      date_trunc(group_unit, (due AT TIME ZONE param_timezone))::date AS day_date,
      COUNT(*) AS total
    FROM cards
    WHERE decks_id = param_decks_id 
      AND due >= utc_start
      AND due <= utc_end
    GROUP BY 1
  ),

  result AS (
    SELECT 
      CASE 
        WHEN group_unit = 'day'   THEN to_char(genseries.bucket, 'YYYY-MM-DD')
        WHEN group_unit = 'week'  THEN to_char(genseries.bucket, 'IYYY-"W"IW') -- e.g., 2026-W08
        WHEN group_unit = 'month' THEN to_char(genseries.bucket, 'YYYY-MM')
        ELSE to_char(genseries.bucket, 'YYYY')
      END AS date,
      COALESCE(cards_count.total, 0) AS count
    FROM genseries
    LEFT JOIN cards_count ON genseries.bucket = cards_count.day_date
    ORDER BY genseries.bucket ASC
  )

  SELECT COALESCE(json_agg(result), '[]'::json) 
  INTO result_json 
  FROM result;

  RETURN result_json;
END
$$;




-- GetCards
CREATE OR REPLACE FUNCTION get_cards(
  param_decks_id uuid,
  param_users_id uuid,
  param_searchtext text,
  param_sortby text,
  param_sortby_direction text,
  param_offset integer DEFAULT 0,
  param_limit integer DEFAULT 20
)
RETURNS SETOF cards
LANGUAGE plpgsql
AS $$
DECLARE

  
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

  -- %L -> literal 'string' stuff with double quote, %I -> identifier table name scheme column name stuff, %s -> simple string insert as is
  RETURN QUERY EXECUTE format('
    SELECT *
    FROM cards
    WHERE decks_id = %L 
    AND data::text ILIKE %L
    ORDER BY %I %s
    LIMIT %L
    OFFSET %L',
    param_decks_id,
    '%' || param_searchtext || '%',
    param_sortby,
    param_sortby_direction,
    param_limit,
    param_offset
  );
END;
$$;




-- GetRetentionRateByDate
-- get retention rate for the date (only the first review of that card for the day is count)
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
  utc_fromdate timestamptz;
  utc_todate timestamptz;
  
BEGIN
  -- Check Permission
  PERFORM 1 FROM decks WHERE id = param_decks_id AND users_id = param_users_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'Deck not found', ERRCODE = '42501';
  END IF;


  utc_fromdate := param_from_date AT TIME ZONE param_timezone;
  utc_todate   := (param_to_date + 1) AT TIME ZONE param_timezone;


  RETURN (
    SELECT json_build_object(
      'from', param_from_date,
      'to', param_to_date,
      'passed', COUNT(*) FILTER (WHERE quality >= 3),
      'failed', COUNT(*) FILTER (WHERE quality < 3)
    )
    FROM (
      SELECT DISTINCT ON (reviews.cards_id, (reviews.createdat AT TIME ZONE param_timezone)::date)
        reviews.quality
      FROM reviews
      JOIN cards ON reviews.cards_id = cards.id
      WHERE cards.decks_id = param_decks_id
        AND reviews.createdat >= utc_fromdate 
        AND reviews.createdat < utc_todate
      ORDER BY 
        reviews.cards_id, 
        (reviews.createdat AT TIME ZONE param_timezone)::date, -- for some reason this have to match the SELCT DISTINCT ON
        reviews.createdat ASC
    ) total_stats
  );
END;
$$;




-- GetDeckStatistic
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
  tmp_card_due_days_count jsonb;
  tmp_card_due_before_yesterday_total integer; -- Changed to integer
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


  -- Overdue cards
  SELECT count(*) INTO tmp_card_due_before_yesterday_total
  FROM cards
  WHERE decks_id = param_decks_id 
    AND status = 1 
    AND due < utc_start;


  -- Due cards range
  -- OPTIMIZE: avoid do anything to table col, it cause index unuseable
  SELECT jsonb_agg(dues) INTO tmp_card_due_days_count
  FROM (
    SELECT 
        genseries.day::date as date,
        COUNT(cards.id) as count
    FROM generate_series(startdate, startdate + INTERVAL '7 days', '1 day'::interval) AS genseries(day)
    LEFT JOIN cards ON 
        (cards.due AT TIME ZONE param_timezone)::date = genseries.day::date
        AND cards.status = 1
        AND cards.decks_id = param_decks_id
    GROUP BY genseries.day
    ORDER BY genseries.day ASC
  ) as dues;


  -- Retention rate (Today's local day only)
  SELECT jsonb_build_object(
    'from', startdate,
    'to', startdate,
    'passed', COUNT(*) FILTER (WHERE quality >= 3),
    'failed', COUNT(*) FILTER (WHERE quality < 3)
  ) INTO tmp_review_retention_rate
  FROM (
    SELECT DISTINCT ON (cards_id) quality
    FROM reviews
    WHERE createdat >= utc_start
      AND createdat < utc_end 
    ORDER BY cards_id, createdat DESC
  ) what;


  
  RETURN json_build_object(
    'date', startdate,
    'cards_status_distribution', tmp_card_status_count,
    'cards_maturity_distribution', tmp_card_maturity_count,
    'cards_due_distribution', tmp_card_due_days_count,
    'cards_overdue_total', tmp_card_due_before_yesterday_total,
    'review_retention_rate', tmp_review_retention_rate,
    'cards_total', tmp_total_count
  );
END;
$$;




-- UpdateCard
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




-- GetDecksWithCardCounts
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
                      OR cards.due < %L
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
    utc_end,                  -- %L
    param_users_id,               -- %L
    '%' || param_searchtext || '%', -- %L
    param_sortby,                 -- %I (The column name)
    param_sortby_direction,       -- %s (ASC or DESC)
    param_offset,                 -- %L
    param_limit                   -- %L
  ) INTO decks_data;

  RETURN json_build_object(
      'date', startdate,
      'decks', COALESCE(decks_data, '[]'::json),
      'total_deck_count', total_deck_count
  );
END;
$$;




-- just type for SM-2
DROP TYPE IF EXISTS sm2_result CASCADE;

CREATE TYPE sm2_result AS (
  interval integer,
  easefactor integer,
  repetition integer,
  status_code integer
);

-- THE SM-2 function
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




-- UpdateCards(? why 's'?)AndAddReview
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




-- GetStudyCardsByStatus
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
  utc_end := utc_start + INTERVAL '1 day';

  SELECT count(*) 
  INTO tmp_total_count 
  FROM cards 
  WHERE decks_id = param_decks_id
  AND status = param_status_code
  AND (
        param_status_code = 2
        OR cards.due < utc_end
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




-- GetStudyCardsInitial (first fetch)
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
  utc_end := utc_start + INTERVAL '1 day';


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
              OR cards.due < utc_end
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
            OR cards.due < utc_end
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
--
-- TABLE dictData                       - data of JMdict
-- COLUMN id BIGINT                         - JMdict's ent-seq
-- COLUMN alltext TEXT                      - JMdict's ke_ele, re_ele, gross.text one by one combined seperated with a space ' '
-- COLUMN priority SMALLINT                 - JMdict's *_pri (except nfXX) store as number value highest = higher priority
-- COLUMN nf SMALLINT                       - JMdict's *_pri (solely nfXX) store as number value highest = higher priority
-- COLUMN data JSONB                        - store the entire JSON of an entry
-- COLUMN updated_at TIMESTAMPZ             - the name suggested
--


CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS dictData (
    id BIGINT PRIMARY KEY
);

-- Ensure required columns exist
ALTER TABLE dictData ADD COLUMN IF NOT EXISTS alltext TEXT;
ALTER TABLE dictData ADD COLUMN IF NOT EXISTS priority SMALLINT;
ALTER TABLE dictData ADD COLUMN IF NOT EXISTS nf SMALLINT;
ALTER TABLE dictData ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE dictData ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Enforce correct column types
ALTER TABLE dictData
    ALTER COLUMN id TYPE BIGINT;
ALTER TABLE dictData
    ALTER COLUMN alltext TYPE TEXT;
ALTER TABLE dictData
    ALTER COLUMN priority TYPE SMALLINT USING priority::SMALLINT;
ALTER TABLE dictData
    ALTER COLUMN nf TYPE SMALLINT USING nf::SMALLINT;
ALTER TABLE dictData
    ALTER COLUMN data TYPE JSONB USING data::JSONB;
ALTER TABLE dictData
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at::timestamptz;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_dictData_alltext_trgm
    ON dictData USING gin (alltext gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dictData_priority
    ON dictData (priority);

CREATE INDEX IF NOT EXISTS idx_dictData_nf
    ON dictData (nf);
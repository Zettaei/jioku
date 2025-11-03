import psycopg

required_columns = {
    "id": "BIGINT PRIMARY KEY",
    "alltext": "TEXT",
    "priority": "SMALLINT",
    "nf": "SMALLINT",
    "data": "JSONB",
    "updated_at": "TIMESTAMPTZ DEFAULT now()",
}

required_indexes = {
    "idx_dictData_alltext_trgm": 
        "CREATE INDEX idx_dictData_alltext_trgm ON dictData USING gin (alltext gin_trgm_ops)",
    "idx_dictData_priority": 
        "CREATE INDEX idx_dictData_priority ON dictData (priority)",
    "idx_dictData_nf": 
        "CREATE INDEX idx_dictData_nf ON dictData (nf)",
}


def ensure_table_schema(cur: psycopg.Cursor):
    # Build CREATE TABLE IF NOT EXISTS dynamically from required_columns
    cols_sql = ",\n    ".join([f"{col} {ctype}" for col, ctype in required_columns.items()])
    cur.execute(f"CREATE TABLE IF NOT EXISTS dictData (\n    {cols_sql}\n);")

    # Ensure extension
    cur.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

    # Ensure required columns exist (drop/re-add if type mismatch)
    for col, coltype in required_columns.items():
        cur.execute("""
            SELECT data_type
            FROM information_schema.columns
            WHERE table_name = 'dictdata' AND column_name = %s;
        """, (col,))

        row = cur.fetchone()
        # add the column if not exist
        if not row:
            cur.execute(f"ALTER TABLE dictData ADD COLUMN {col} {coltype};")
        # if the column is incorrect type drop it and add new column
        else:
            db_type = row[0].upper()
            if coltype.split()[0] not in db_type:
                cur.execute(f"ALTER TABLE dictData DROP COLUMN {col};")
                cur.execute(f"ALTER TABLE dictData ADD COLUMN {col} {coltype};")

    # Ensure required indexes (drop incorrect, recreate)
    for idx, sql_cmd in required_indexes.items():
        cur.execute("""
            SELECT indexdef
            FROM pg_indexes
            WHERE tablename = 'dictdata' AND indexname = %s;
        """, (idx,))
        row = cur.fetchone()
        if not row:
            cur.execute(sql_cmd + ";")
        else:
            indexdef = row[0].strip().upper()
            required_def = sql_cmd.strip().upper()
            if required_def not in indexdef:
                cur.execute(f"DROP INDEX IF EXISTS {idx};")
                cur.execute(sql_cmd + ";")
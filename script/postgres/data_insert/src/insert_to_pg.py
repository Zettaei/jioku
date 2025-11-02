from pathlib import Path
from psycopg import OperationalError
from psycopg.types.json import Json
import json
import psycopg
import os
from score_priority import score_priority

def read_dict_json(file_path: Path):
    with file_path.with_suffix(".json").open("r", encoding="utf-8") as file:
        return json.load(file)

def connect_to_db():
    return psycopg.connect(
        host=os.getenv("JIOKU_PG_HOST"),
        dbname=os.getenv("JIOKU_PG_DB"),
        user=os.getenv("JIOKU_PG_USER"),
        password=os.getenv("JIOKU_PG_PASSWORD"),
        port=os.getenv("JIOKU_PG_EXPOSE_PORT")
)

def create_table_dictData(cur: psycopg.Cursor):

    cur.execute("""
        CREATE TABLE IF NOT EXISTS dictData (
            id BIGINT PRIMARY KEY,
            alltext TEXT,
            priority BOOLEAN,
            data JSONB
        );
        """)
    
    cur.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
    
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_dictData_alltext_trgm
        ON dictData USING gin (alltext gin_trgm_ops);
    """)
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_dictData_priority
        ON dictData (priority);
    """)

    
def insert_to_table_dictData(cur: psycopg.Cursor, data: list):
    for row in data:

        if(not row.get("ent_seq") or not row.get("all")):
            continue

        isCommon: bool = (
            any( k.get("ke_pri") for k in row.get("k_ele", []) ) or
            any( r.get("re_pri") for r in row.get("r_ele", []) )
        )

        # EXCLUDED is a special table reference to your insert data
        cur.execute(
            """
            INSERT INTO dictData 
                (id, alltext, priority, data)
            VALUES 
                (%s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                alltext = EXCLUDED.alltext,
                priority = EXCLUDED.priority,
                data = EXCLUDED.data
            """,
            (
                row["ent_seq"],
                row["all"],
                sum(score_priority(p) for p in set(all_pri_list)),
                Json(row)
            )
        )


def insert_to_pg(file_path: Path):

    print(">> reading json...")
    data = read_dict_json(file_path)

    try:
        print(">> connecting to Postgres...")
        conn = connect_to_db()
        cur = conn.cursor()

        print(">> inserting dictionary data to database: \"" + str(os.getenv("JIOKU_PG_DB")) + "\", this might take multiple minutes...")
        create_table_dictData(cur)
        insert_to_table_dictData(cur, data)

        conn.commit()
        conn.close()
        
    except OperationalError as e:
        raise e



__all__ = ["insert_to_pg"]
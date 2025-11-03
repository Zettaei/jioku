from pathlib import Path
from psycopg import OperationalError
from psycopg.types.json import Json
from psycopg import errors
import json
import psycopg
import os
from score_priority import score_priority
from score_nf import score_nf
import config

cur: psycopg.Cursor
conn = None



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

def create_table_dictData():
    sql = None

    def prompt_for_recreate_table():
        print(">>\n>> do you want to delete and recreate the entire table? (y/N): ", end='')
        cmd = str(input()).lower()
        if(cmd == 'y' or cmd == "yes"):
            return True
        
        return False
            
    try:
        if(sql is None):
            with open(config.BASE_DIR / "database" / "schema" / config.SCHEMA_FILENAME, "r", encoding="utf-8") as f:
                sql = f.read()

        cur.execute(sql)
        conn.commit()

    # This is the specific error for "invalid input syntax for type ..."
    except psycopg.errors.InvalidTextRepresentation as e:
        print(">> !!!!!!!!!!!!!!!!!!!!\n Type conversion failed:", e)
        conn.rollback()

        if(prompt_for_recreate_table() == True):
            cur.execute("DROP TABLE IF EXISTS table_name")
            conn.commit()

            create_table_dictData()
        
    
def insert_to_table_dictData(data: list):
    for row in data:

        if(not row.get("ent_seq") or not row.get("all")):
            continue

        pri_set = set()
        nf_set = set()

        for k in row.get("k_ele", []):
            pri_set.update(k.get("ke_pri", []))
        for r in row.get("r_ele", []):
            pri_set.update(r.get("re_pri", []))

        # Separate nf entries
        for p in list(pri_set):  # list() so we can modify pri_set safely
            if p.startswith("nf"):
                nf_set.add(p)
                pri_set.remove(p)

        # EXCLUDED is a special table reference to your insert data
        cur.execute(
            """
            INSERT INTO dictData 
                (id, alltext, priority,  data)
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
                sum(score_priority(p) for p in pri_set),
                max(score_nf(nf) for nf in nf_set),
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
        create_table_dictData()
        insert_to_table_dictData(data)

        conn.commit()
        conn.close()
        
    except OperationalError as e:
        raise e



__all__ = ["insert_to_pg"]
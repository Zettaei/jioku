import psycopg
import os

def connect_to_db():
    host = os.getenv("SCRIPT_PG_HOST")
    port = os.getenv("SCRIPT_PG_PORT")
    dbname = os.getenv("SCRIPT_PG_DBNAME")
    user = os.getenv("SCRIPT_PG_USER")
    password = os.getenv("SCRIPT_PG_PASSWORD")
    return psycopg.connect(conninfo=f"dbname={dbname} user={user} password={password} host={host} port={port} connect_timeout={10}")

def connect_to_postgres():
    print(">> Connecting to Postgres...")
    try:
        db = connect_to_db()
        cur = db.cursor()
        cur.execute("SELECT 1;")   # will throw error if connection wrong
        result = cur.fetchone()

        cur.close()

        print(">> Successfully connected to Postgres.\n>>")
        return db

    except (psycopg.errors.ConnectionException, psycopg.errors.OperationalError) as e:
        print(">> Failed to establish connection to Postgres.")
        
        raise e
    
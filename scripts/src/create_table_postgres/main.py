from pathlib import Path
import create_table_postgres.utils as utils
from dotenv import load_dotenv, find_dotenv


def create_table_postgres():

    # if(utils.check_env() == False):
    try:
        db = utils.connect_to_postgres()

        cur = db.cursor()

        cur.execute(utils.read_extension())
        print(">>\t[OK] extensions created.")
        cur.execute(utils.read_table_and_index())
        print(">>\t[OK] tables and indices created.")

        db.commit()

        print(">>\n>> Successfully created table to Postgres.")

    except Exception as e:
        print(e)
        print(">> Cancelled")
        try:
            if(db):
                db.rollback()
        except:
            None

    finally:
        try:
            if(db):
                db.close()
        except:
            None

        return



def main():
    load_dotenv(find_dotenv(".env"))
    create_table_postgres()
    print(">>")



if __name__ == "__main__":
    main()
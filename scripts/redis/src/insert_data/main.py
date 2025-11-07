from pathlib import Path
import insert_data.utils as utils
from dotenv import load_dotenv, find_dotenv
import redis
from config import config


def insert_data(file_path: Path):

    # if(utils.check_env() == False):
    try:
        db: redis = utils.connect_to_redis()
    except:
        print(">> Cancelled")
        return
    
    utils.insert_to_redis(db, file_path)

    print(">>\n>> Successfully inserted dictionary data to Redis.")


def main():
    load_dotenv(find_dotenv(".env"))
    file_path = Path(config["dict"]["file_path"]).resolve()
    insert_data(file_path)
    print(">>")



if __name__ == "__main__":
    main()
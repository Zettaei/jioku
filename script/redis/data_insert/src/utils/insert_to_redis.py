from pathlib import Path
import json
from datetime import datetime
import redis
from .score_priority import score_priority
from .score_nf import score_nf
import config


db: redis

def read_dict_json(file_path: Path):
    with file_path.with_suffix(".json").open("r", encoding="utf-8") as file:
        return json.load(file)
    
def read_dict_metadata_json(file_path: Path):
    json_metadata_file = (file_path.parent / f"{config.DICT_FILENAME}_metadata.json")
    with json_metadata_file.with_suffix(".json").open("r", encoding="utf-8") as file:
        return json.load(file)


def create_index(db: redis):
    INDEX_NAME = "dict:entry_idx"

    # Check if index exists
    try:
        db.execute_command("FT.INFO", INDEX_NAME)
        index_exists = True
    except redis.exceptions.ResponseError:
        index_exists = False

    # Drop if exists
    if index_exists:
        db.execute_command("FT.DROPINDEX", INDEX_NAME)

    # Create index
    with open(config.BASE_DIR / "database" / "schema" / config.INDEX_SCHEMA_FILENAME, "r", encoding="utf-8") as f:
        command = f.read()
        db.execute_command(command)
    
def insert_data(db: redis, data: list):

    db.flushdb(asynchronous=True)

    BATCH_SIZE = config.REDIS_INSERT_BATCH_SIZE
    pipe = db.pipeline(transaction=False)  # use False for speed, True if atomic needed

    for start in range(0, len(data), BATCH_SIZE):
        batch = data[start:start + BATCH_SIZE]

        for entry in batch:
            key = f"dict:entry:{entry['ent_seq']}"
            pipe.json().set(key, '$', entry)

        pipe.execute()

def insert_metadata(db: redis, metadata: dict):

    metadata["inserted"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    key = "dict:metadata"
    db.json().set(key, "$", metadata)


def insert_to_redis(db: redis, file_path: Path):

    print(">> Reading JSONs...")
    data = read_dict_json(file_path)
    metadata = read_dict_metadata_json(file_path)

    try:
        print(">> Inserting dictionary data and metadata to Redis, this may take a few minutes...")
        insert_data(db, data)
        insert_metadata(db, metadata)
        print(">> Successfully inserted data and metadata at dict:entry: and dict:metadata: in Redis\n>>")

        print(">> Creating indexes...")
        create_index(db)
        print(">> Successfully created indexes at dict:entry: in Redis\n>>")

        db.execute_command("SAVE")
        
    except Exception as e:
        raise e



__all__ = ["insert_to_redis"]
from pathlib import Path
import json
from datetime import datetime
import redis
from config import config


db: redis

def read_dict_json(file_path: Path):
    with file_path.with_suffix(".json").open("r", encoding="utf-8") as file:
        return json.load(file)
    
def read_dict_metadata_json(file_path: Path):
    json_metadata_file = Path(file_path.parent / f"{file_path.stem}_metadata").with_suffix(".json").resolve()
    with json_metadata_file.open("r", encoding="utf-8") as file:
        return json.load(file)


def create_index(db: redis):
    dict_index_file = Path(config["redis"]["schema"]["dict_index_file_path"]).resolve()

    # Create index
    with open(dict_index_file, "r", encoding="utf-8") as f:
        command = f.read()
        db.execute_command(command)


def drop_index(db: redis, index_name: str):
    # Check if index exists
    try:
        db.execute_command("FT.INFO", index_name)
        index_exists = True
    except redis.exceptions.ResponseError:
        index_exists = False

    # Drop if exists
    if index_exists:
        db.execute_command("FT.DROPINDEX", index_name)

    
def insert_data(db: redis, entry_name: str, data: list, batch_size: int) -> int:

    count = 0
    pipe = db.pipeline(transaction=False)

    for start in range(0, len(data), batch_size):
        batch = data[start:start + batch_size]

        for entry in batch:
            key = f"{entry_name}:{entry['ent_seq']}"
            pipe.json().set(key, '$', entry)
            count += 1

        pipe.execute()

    return count


def drop_data(db: redis, entry_name: str, batch_size: int):
    pipe = db.pipeline(transaction=False)

    count = 0
    for key in db.scan_iter(match=entry_name, count=batch_size):
        pipe.delete(key)

        count += 1
        if count % batch_size == 0:
            pipe.execute()
    
    return count
    

def insert_metadata(db: redis, metadata_name: str, metadata: dict) -> int:

    count = 0
    key = metadata_name
    metadata["inserted"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    count = len(metadata)
    db.json().set(key, "$", metadata)

    return count


def insert_to_redis(db: redis, file_path: Path):

    print(">> Reading JSONs...")
    data = read_dict_json(file_path)
    metadata = read_dict_metadata_json(file_path)

    ### PLEASE DO NOT CHANGE THESE vvv PLEASE PLEASE PLEASE PLEASE
    # ENTRY_NAME and INDEX_NAME actually follow the schema in schema/dictIndex.redis
    # please make sure to change in those as well, if you change these
    ENTRY_NAME = "dict:entry"
    METADATA_NAME = "dict:metadata"
    INDEX_NAME = "dict:entry_idx"
    BATCH_SIZE = config["redis"]["insert_batch_size"]

    try:

        print(">> Inserting data to Redis, this may take a few minutes...")
        drop_index(db, INDEX_NAME)
        print(">>\t[OK] Dropped all indices at dict:entry...")
        drop_data(db, ENTRY_NAME, BATCH_SIZE)
        print(">>\t[OK] Dropped all data at dict:entry")
        data_inserted_count: int = insert_data(db, ENTRY_NAME, data, BATCH_SIZE)
        print(f">>\t[OK] Inserted {data_inserted_count} data at dict:entry:")
        metadata["count_inserted"] = data_inserted_count
        metadata_inserted_count: int = insert_metadata(db, METADATA_NAME, metadata)
        print(f">>\t[OK] Inserted {metadata_inserted_count} metadata at dict:metadata:")

        print(">>\t[OK] Creating indices dict:entry...")
        create_index(db)
        print(">> Successfully inserted data to Redis")

        db.execute_command("SAVE")
        print(">>\n>> Redis snapshot created.")
        
    except Exception as e:
        raise e



__all__ = ["insert_to_redis"]
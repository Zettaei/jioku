from dotenv import load_dotenv
from pathlib import Path
import utils
import redis
import config

def run_parsing(file_path: Path):
    print(">> Starting parsing process, this might take multiple minutes...")
    utils.parse_data_to_json(file_path)
    utils.transform_for_redis(file_path)
    utils.parse_metadata_to_json(file_path)
    print(">> Successfully parsed dictionary data and metadata to JSON")


def __main__():
    file_path = config.BASE_DIR / "data" / "dict" / config.DICT_FILENAME

    load_dotenv(file_path.parent.parent.parent / ".env")

    if utils.check_env() == False:
        raise RuntimeError("Missing one or more environment variables, please look at .env.example for reference and make a .env file at the same place")
    
    print("\n\n>> ")

    print(">> WARNING: this will delete every dict: and dict_metadata: keys in Redis and insert new one in")
    cmd = str(input(">> Do you want to proceed (y/N):").strip().lower())
    print(">>")

    if(cmd == "" or not(cmd == 'y'or cmd == 'yes')):
        print(">> CANCEL")
        return 
    
    cmd = ""

    json_file = (file_path.parent / f"{config.DICT_FILENAME}.json")
    json_metadata_file = (file_path.parent / f"{config.DICT_FILENAME}_metadata.json")

    if utils.check_file_exist(json_file) == False or utils.check_file_exist(json_metadata_file) == False:
        run_parsing(file_path)

    else:
        print(f">> \"{json_file.name}\" or \"{json_metadata_file.name}\" exists")
        print(">> \t1  Delete all and re-parse the dictionary.")
        print(">> \t2  Continue - this will fail if the file contents are invalid")
        print(">> \t3  Cancel")
        cmd = input(">> What do you want to do? (default: 3): ").strip()
        print(">>")
        
        if(cmd == "1"):
            json_file.unlink(missing_ok=True)
            print(">> Existing JSON deleted.\n>>")
            run_parsing(file_path) 
        elif(cmd == "2"):
            None
        else:
            print(">> CANCEL")
            return


    print(">>")

    file_path = file_path.with_name(config.DICT_FILENAME).with_suffix(".json")

    db: redis = utils.connect_to_redis()
    utils.insert_to_redis(db, file_path)

    print(">> Successfully inserted dictionary data to Redis.")
    print(">>\n")
    return



__main__()
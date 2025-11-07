from pathlib import Path
import parse_dict.utils as utils
from config import config
from shared.utils.check_file_exist import check_file_exist

def parse_dict(file_path: Path):
    json_data_file = file_path.with_suffix(".json").resolve()
    json_metadata_file = Path(file_path.parent / f"{file_path.stem}_metadata").with_suffix(".json").resolve()

    if (check_file_exist(json_data_file)) == False or (check_file_exist(json_metadata_file) == False):
        None

    else:
        print(f">> \"{json_data_file.name}\" or \"{json_metadata_file.name}\" exist.")
        print(">> \t1  Delete all and re-parse the dictionary.")
        print(">> \t2  Continue - this will fail if the file contents are invalid")
        print(">> \t3  Cancel")
        cmd = input(">> What do you want to do? (default: 2): ").strip()
        print(">>")
        
        if(cmd == "1"):
            json_data_file.unlink(missing_ok=True)
            json_metadata_file.unlink(missing_ok=True)
            print(">> Existing JSONs deleted.")
        elif(cmd == "2"):
            print(">> Use existing JSONs.")
            return True
        elif(cmd == "3"):
            print(">> CANCEL")
            return False
    
    print(">>\n>> Starting parsing process, this might take multiple minutes...")
    utils.parse_data_to_json(file_path)
    utils.transform_for_redis(file_path)
    print(">>\t[OK] Dictionary has been parsed to JSON")
    utils.parse_metadata_to_json(file_path)
    print(">>\t[OK] Metadata has been parsed to JSON")
    print(">> Successfully parsed dictionary data and metadata to JSON.")


def main() -> bool:
    file_path = Path(config["dict"]["file_path"]).resolve()
    isContinue = parse_dict(file_path)
    print(">>")
    return isContinue



if __name__ == "__main__":
    main()
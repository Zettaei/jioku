from pathlib import Path
from parse_data_to_json import parse_data_to_json
from check_file_exist import check_file_exist
from add_all_column import add_all_column
from insert_to_pg import insert_to_pg
from check_env import check_env
from dotenv import load_dotenv


## EDIT ONLY THIS ONE
filename = "JMdict_e"

base_dir = Path(__file__).resolve().parent.parent.parent.parent.parent   ## BACK TO THE ROOT


def __main__():
    file_path = base_dir / "data" / "dict" / filename

    load_dotenv(file_path.parent.parent.parent / ".env")

    if check_env() == False:
        raise RuntimeError("Missing one or more PostgreSQL environment variables.")
    

    if check_file_exist(file_path) == False:
        print(">> \"" + str(file_path.resolve()) + "\" does not exist.\n" +
        ">> starting parsing process, this might take multiple minutes...")
    
        parse_data_to_json(file_path)
        add_all_column(file_path)
    else:
        print(">> \"" + str(file_path.resolve()) + "\" exist.\n" +
        ">> skipping parsing process.")

    print(">>")
    file_path = file_path.with_name(filename + ".json")
    
    insert_to_pg(file_path)

    print(">> successfully inserted dictionary data.")
    return



__main__()
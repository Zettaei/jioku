from dotenv import load_dotenv
import utils
import config


def __main__():
    file_path = config.BASE_DIR / "data" / "dict" / config.DICT_FILENAME

    load_dotenv(file_path.parent.parent.parent / ".env")

    if utils.check_env() == False:
        raise RuntimeError("Missing one or more PostgreSQL environment variables.")
    

    if utils.check_file_exist(file_path) == False:
        print(">> \"" + str(file_path.resolve()) + "\" does not exist.\n" +
        ">> starting parsing process, this might take multiple minutes...")
    
        utils.parse_data_to_json(file_path)
        utils.add_all_column(file_path)
    else:
        print(">> \"" + str(file_path.resolve()) + "\" exist.\n" +
        ">> skipping parsing process.")

    print(">>")
    file_path = file_path.with_name(config.DICT_FILENAME).with_suffix(".json")
    
    utils.insert_to_pg(file_path)

    print(">> successfully inserted dictionary data.")
    return



__main__()
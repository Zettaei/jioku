from pathlib import Path
from parse_data_to_json import parse_data_to_json
from check_file_exist import check_file_exist
from add_all_column import add_all_column



## EDIT ONLY THIS ONE
filename = "JMdict_e"



base_dir = Path(__file__).resolve().parent.parent.parent.parent.parent   ## BACK TO THE ROOT
file_path = base_dir / "data" / "dict" / filename

def __main__():
    if check_file_exist(file_path) == False:
        print(">> \"" + str(file_path.resolve()) + "\" does not exist, \n" +
        ">> starting parsing process..., this might take up to a few minutes")
    
        parse_data_to_json(file_path)
        add_all_column(file_path)
    else:
        print(">> \"" + str(file_path.resolve()) + "\" exist, \n" +
        ">> skipping parsing process")

    print(">>")

    # FUNCTION FOR INSERT TO POSTGRESQL



__main__()
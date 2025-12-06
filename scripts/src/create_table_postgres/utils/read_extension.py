from config import config

def read_extension():
    with open(config["postgres"]["schema"]["extension_file_path"], "r", encoding="utf-8") as f:
        sql = f.read()

    return sql

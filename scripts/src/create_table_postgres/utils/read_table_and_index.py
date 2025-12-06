from config import config

def read_table_and_index():
    with open(config["postgres"]["schema"]["table_and_index_file_path"], "r", encoding="utf-8") as f:
        sql = f.read()
    return sql

        

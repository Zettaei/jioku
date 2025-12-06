from create_table_postgres.main import main as postgres_creating

# NOTE: add delete table and recreate option, better if check the column before (also add some confirmation prevent accidentally deletetion)
def postgres():
    print(">>")
    
    postgres_creating()


if __name__ == "__main__":
    postgres()
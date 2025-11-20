from parse_dict.main import main as parsing
from insert_dict_redis.main import main as inserting

def main():
    print(">>")
    
    isContinue = parsing()
    if(isContinue == False):
        return
    
    inserting()


if __name__ == "__main__":
    main()
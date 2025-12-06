from parse_dict.main import main as redis_parsing
from insert_dict_redis.main import main as redis_inserting

def redis():
    print(">>")
    
    isContinue = redis_parsing()
    if(isContinue == False):
        return
    
    redis_inserting()


if __name__ == "__main__":
    redis()
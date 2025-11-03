import redis
import os

def connect_to_db():
    return redis.Redis(
        host=os.getenv("JIOKU_REDIS_HOST"),
        port=os.getenv("JIOKU_REDIS_EXPOSE_PORT"),
        password=os.getenv("JIOKU_REDIS_PASSWORD"),
        decode_responses=True
)

def check_redis_module(db: redis.Redis) -> bool:

    modules = db.execute_command("MODULE LIST")  # returns list of dicts

    module_names = [mod['name'] for mod in modules]

    isPass = True

    if "ReJSON" in module_names:
        print(">>\t✓  RedisJSON available")
    else:
        isPass = False
        print(">>\t✕  RedisJSON is NOT available.")

    if "search" in module_names:
        print(">>\t✓  RediSearch available")
    else:
        isPass = False
        print(">>\t✕  RediSearch is NOT available.")


    return isPass



def connect_to_redis() -> redis:
    print(">> Connecting to Redis...")
    try:
        db = connect_to_db()
        db.ping()   # will throw error if connection wrong
        print(">> Successfully connected to Redis.\n>>")



        print(">> Checking required Redis modules")

        if(check_redis_module(db) == False):
            raise redis.RedisError("Required Redis modules missing")
        
        print(">> Successfully checking required Redis modules.\n>>")
        
    except redis.RedisError as e:
        try:
            db.close()
        except:
            pass

        raise e
    
    return db

    

__all__ = ["connect_to_redis"]
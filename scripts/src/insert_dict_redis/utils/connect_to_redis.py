import redis
import os

def connect_to_db():
    return redis.Redis(
        host=os.getenv("SCRIPT_REDIS_HOST"),
        port=os.getenv("SCRIPT_REDIS_PORT", 0),   ## 0 to avoid throwing error
        password=os.getenv("SCRIPT_REDIS_PASSWORD"),
        decode_responses=True
)

def check_redis_module(db: redis.Redis) -> bool:

    modules = db.execute_command("MODULE LIST")  # returns list of dicts

    module_names = [mod['name'] for mod in modules]

    isPass = True

    if "ReJSON" in module_names:
        print(">>\t[OK] RedisJSON available")
    else:
        isPass = False
        print(">>\t[FAIL] RedisJSON is NOT available.")

    if "search" in module_names:
        print(">>\t[OK] RediSearch available")
    else:
        isPass = False
        print(">>\t[FAIL] RediSearch is NOT available.")


    return isPass



def connect_to_redis() -> redis:
    print(">> Connecting to Redis...")
    try:
        db = connect_to_db()
        db.ping()   # will throw error if connection wrong
        print(">> Successfully connected to Redis.\n>>")
    except redis.RedisError as e:
        print(">> Failed to establish connection to Redis.")
        
        raise e


    try:
        print(">> Checking required Redis modules.")

        if(check_redis_module(db) == False):
            raise redis.RedisError("Required Redis modules missing.")
        
        print(">> Successfully checking required Redis modules.\n>>")
        
    except redis.RedisError as e:
        db.close()

        raise e
    
    return db

    

__all__ = ["connect_to_redis"]
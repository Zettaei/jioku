import os

def check_env(): 
    if (os.getenv("JIOKU_REDIS_HOST") is None or
        os.getenv("JIOKU_REDIS_EXPOSE_PORT") is None or
        os.getenv("JIOKU_REDIS_PASSWORD") is None
    ):
        return False
    
    return True

__all__ = ["check_env"]
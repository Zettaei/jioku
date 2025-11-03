import os

def check_env(): 
    if (os.getenv("JIOKU_PG_HOST") is None or
        os.getenv("JIOKU_PG_EXPOSE_PORT") is None or
        os.getenv("JIOKU_PG_USER") is None or
        os.getenv("JIOKU_PG_PASSWORD") is None or
        os.getenv("JIOKU_PG_DB") is None
    ):
        return False
    
    return True

__all__ = ["check_env"]
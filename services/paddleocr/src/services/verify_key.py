from fastapi import Header, HTTPException
from src.services.logger import logger
from src.config import _API_KEY
import os

# Look for an HTTP header with the same name
# (x-api-key in this case — FastAPI automatically 
# converts underscores _ to hyphens - for HTTP headers).

# P.S. HTTP headers are case-insensitive (lowercase or uppercase is fine)
def verify_key(x_api_key: str = Header(...)):
    apiKey = _API_KEY

    if apiKey is None:
        pass
    elif x_api_key != apiKey:
        logger.warning("API_KEY | Incorrect API Key Accessed")
        raise HTTPException(status_code=401, detail="Incorrect API Key")


    return
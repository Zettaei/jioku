from fastapi import Header, HTTPException
import os

# Look for an HTTP header with the same name
# (x-api-key in this case — FastAPI automatically 
# converts underscores _ to hyphens - for HTTP headers).

# P.S. HTTP headers are case-insensitive (lowercase or uppercase is fine)
def verify_key(x_api_key: str = Header(...)):
    key = os.getenv("PADDLEOCR_API_KEY")

    if key is None:
        pass
    elif x_api_key != key:
        raise HTTPException(status_code=401, detail="Incorrect API Key")


    return
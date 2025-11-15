import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.routes.ocr import router as ocr_router
from src.routes.default import router as default_router
from src.services import logger

# LOGGER NOT WORK FOR WHATEVER REASON

PORT = 8000

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("SERVER_INFO | Server run on Port: %d", PORT)
        yield   # yield is like return but not end the function
    except Exception:
        logger.critical("SERVER_ERROR | Something wrong with server", exc_info=True)
    finally:
        logger.info("SERVER_INFO | Server shutting down")


app = FastAPI(lifespan=lifespan)
app.include_router(default_router)
app.include_router(ocr_router)


IS_PROD = os.getenv("ENV", "dev") == "production"
import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.config import WHITELISTED_IP, APP_ENV, HAS_API_KEY
from src.routes.ocr import router as ocr_router
from src.routes.default import router as default_router
from src.services import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("SERVER_INFO | Server running in %s mode", APP_ENV)
        logger.info("SERVER_INFO | Whitelisted IP: %s", ", ".join(WHITELISTED_IP))
        logger.info("SERVER_INFO | API Key is " + ("used" if HAS_API_KEY else "not used"))
        yield   # yield is like return but not end the function
    except Exception:
        logger.critical("SERVER_ERROR | Something wrong with server", exc_info=True)
    finally:
        logger.info("SERVER_INFO | Server shutting down")


app = FastAPI(lifespan=lifespan)
app.include_router(default_router)
app.include_router(ocr_router)
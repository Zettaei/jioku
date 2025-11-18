from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/")
async def default():

    return {
        "message": "server is running",
    }
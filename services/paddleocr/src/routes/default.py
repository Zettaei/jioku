from fastapi import APIRouter, Request
import os

router = APIRouter()

@router.get("/")
async def default(request: Request):

    return {
        "message": "It works!",
    }
import os

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

def allowed_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename)
    return ext.lower() in ALLOWED_EXTENSIONS
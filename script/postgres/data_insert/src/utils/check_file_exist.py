import os
from pathlib import Path

def check_file_exist(file_path: Path): 
    if os.path.exists(file_path.with_suffix(".json")):
        return True
    else:
        return False

__all__ = ["check_file_exist"]
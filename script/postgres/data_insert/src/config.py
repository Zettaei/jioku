from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent   ## BACK TO THE ROOT

DICT_FILENAME = "JMdict_e"
SCHEMA_FILENAME = "dictData.sql"


__all__ = [BASE_DIR, DICT_FILENAME, SCHEMA_FILENAME]
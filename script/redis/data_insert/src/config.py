from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent   ## BACK TO THE ROOT

DICT_FILENAME = "JMdict_e"
INDEX_SCHEMA_FILENAME = "dictIndex.redis"

REDIS_INSERT_BATCH_SIZE = 2000


__all__ = [BASE_DIR, DICT_FILENAME, INDEX_SCHEMA_FILENAME, REDIS_INSERT_BATCH_SIZE]
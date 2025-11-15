import logging
from pathlib import Path
from logging.handlers import TimedRotatingFileHandler

LOGS_DIR = Path(__file__).parents[2] / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
INFO_LOGS_FILE_PATH = LOGS_DIR / "info.log"
ERROR_LOGS_FILE_PATH = LOGS_DIR / "error.log"
FORMAT = "%(asctime)s - %(levelname)s - %(message)s"

ROTATION_WHEN = "W6"          # Weekly W0-W6, W6 = Sunday
ROTATION_INTERVAL = 1         # 1 = every Sunday, 4 = every 4 Sunday (every 4 weeks)
ROTATION_BACKUP_COUNT = 8     # 8 = backup for 8 Sunday(s)


logger = logging.getLogger("paddleocr")
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter(FORMAT)

# INFO and DEBUG
info_handler = TimedRotatingFileHandler(
    INFO_LOGS_FILE_PATH, when=ROTATION_WHEN, interval=ROTATION_INTERVAL, backupCount=ROTATION_BACKUP_COUNT
)
info_handler.addFilter(lambda logRecord: logRecord.levelno == logging.INFO)  # Only INFO
info_handler.setLevel(logging.INFO)       
info_handler.setFormatter(formatter)

# WARNING and above
error_handler = TimedRotatingFileHandler(
    ERROR_LOGS_FILE_PATH, when=ROTATION_WHEN, interval=ROTATION_INTERVAL, backupCount=ROTATION_BACKUP_COUNT
)
error_handler.setLevel(logging.WARNING)
error_handler.setFormatter(formatter)


logger.addHandler(info_handler)
logger.addHandler(error_handler)

__all__ = ["logger"]
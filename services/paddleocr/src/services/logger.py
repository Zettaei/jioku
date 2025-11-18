from pathlib import Path
import logging
from logging import StreamHandler
from logging.handlers import TimedRotatingFileHandler
from src.config import LOGGER

LOGS_DIR = Path(__file__).parents[2] / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
ROTATION = LOGGER["rotation"]


logger = logging.getLogger("uvicorn.info")
logger.setLevel(LOGGER["level"])
formatter = logging.Formatter(LOGGER["format"])

# INFO
info_handler = TimedRotatingFileHandler(
    (LOGS_DIR / LOGGER["filename"]["info"]), when=ROTATION["when"], interval=ROTATION["interval"], backupCount=ROTATION["backup_count"]
)
info_handler.addFilter(lambda logRecord: logRecord.levelno == logging.INFO)  # Only INFO
info_handler.setLevel(logging.INFO)       
info_handler.setFormatter(formatter)

# WARNING and above
error_handler = TimedRotatingFileHandler(
    (LOGS_DIR / LOGGER["filename"]["error"]), when=ROTATION["when"], interval=ROTATION["interval"], backupCount=ROTATION["backup_count"]
)
error_handler.setLevel(logging.WARNING)
error_handler.setFormatter(formatter)


logger.addHandler(info_handler)
logger.addHandler(error_handler)

__all__ = ["logger"]
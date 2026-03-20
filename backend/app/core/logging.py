import logging
import sys
from pathlib import Path
from app.core.config import LOGS_DIR, DEBUG

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
LOG_FILE = Path(LOGS_DIR) / "app.log"


def setup_logging() -> logging.Logger:
    """Configure root logger for the application."""
    level = logging.DEBUG if DEBUG else logging.INFO

    formatter = logging.Formatter(LOG_FORMAT, datefmt="%Y-%m-%d %H:%M:%S")

    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(formatter)
    console.setLevel(level)

    # File handler
    file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)

    root = logging.getLogger("autoinsight")
    root.setLevel(level)
    root.addHandler(console)
    root.addHandler(file_handler)

    return root


logger = setup_logging()

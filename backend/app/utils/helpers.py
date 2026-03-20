import uuid
import time
from datetime import datetime


def generate_id() -> str:
    return str(uuid.uuid4())[:8]


def timestamp_now() -> str:
    return datetime.utcnow().isoformat()


class Timer:
    """Simple context-manager timer."""
    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, *_):
        self.elapsed = round(time.perf_counter() - self._start, 4)

    @property
    def elapsed_ms(self):
        return round(self.elapsed * 1000, 2)


def safe_dict(obj: dict) -> dict:
    """Convert numpy/pandas types to JSON-serializable Python types."""
    import numpy as np
    clean = {}
    for k, v in obj.items():
        if isinstance(v, (np.integer,)):
            clean[k] = int(v)
        elif isinstance(v, (np.floating,)):
            clean[k] = round(float(v), 6)
        elif isinstance(v, np.ndarray):
            clean[k] = v.tolist()
        else:
            clean[k] = v
    return clean


def truncate(text: str, length: int = 200) -> str:
    return text[:length] + "..." if len(text) > length else text

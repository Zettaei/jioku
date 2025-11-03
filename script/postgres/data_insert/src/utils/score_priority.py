SCORE_MAP = {
    "news1": 20,
    "news2": 10,
    "ichi1": 20,
    "ichi2": 10,
    "spec1": 20,
    "spec2": 10,
    "gai1": 20,
    "gai2": 10,
}

def score_priority(pri: str = None):
    return SCORE_MAP.get(pri, 0)


__all__ = ["score_priority"]
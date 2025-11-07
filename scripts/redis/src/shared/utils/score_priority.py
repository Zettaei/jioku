SCORE_MAP = {
    "news1": 3,
    "news2": 2,
    "ichi1": 3,
    "ichi2": 2,
    "spec1": 3,
    "spec2": 2,
    "gai1": 3,
    "gai2": 2,
}

def score_priority(pri: str = None):
    return SCORE_MAP.get(pri, 1)


__all__ = ["score_priority"]
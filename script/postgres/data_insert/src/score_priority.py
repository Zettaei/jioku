SCORE_MAP = {
    "news1": 200,
    "ichi1": 200,
    "news2": 100,
    "ichi2": 100,
    "spec1": 0,
    "spec2": 0,
    "gai1": 0,
    "gai2": 0,
}

def score_nf(pri: str):
    return int(pri[2:])

def score_priority(pri: str = None):
    return SCORE_MAP.get(pri, 0)



__all__ = score_priority
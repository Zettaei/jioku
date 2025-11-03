def score_nf(pri: str):
    # return -(int(pri[2:]))
    # return int(pri[2:])*-1
    return 100 - int(pri[2:])

__all__ = ["score_nf"]

def score_sort(len: int, pri: int, nf: int):
    # return -(int(pri[2:]))
    # return int(pri[2:])*-1
    return (len * 100000 + 5000) - (pri * 1_000 + 500) - nf

__all__ = ["score_sort"]
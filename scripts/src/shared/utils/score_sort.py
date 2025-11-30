
def score_sort(len: int, pri: int, nf: int):
    # return -(int(pri[2:]))
    # return int(pri[2:])*-1
    return (len * 1000000 + 50000) - (pri * 1000 + 500) - nf

__all__ = ["score_sort"]
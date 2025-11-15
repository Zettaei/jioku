
def rearrange_result(result: dict[str, list]) -> list[dict[str, list]]:

    # this rearrange might slow down a bit, idk, but it's more readable, easier useable
    results = [
        {"text": t, "score": s, "poly": p.tolist()}
        for t, s, p in zip(result["texts"], result["scores"], result["polys"])
    ]

    return results
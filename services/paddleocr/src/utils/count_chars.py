

def count_chars(texts: str) -> int:
    char_len: int = 0
    
    if (texts is not None):
        char_len = sum(len(str(t)) for t in texts)

    return char_len
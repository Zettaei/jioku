import json
from pathlib import Path

def transform_text_list(text_list): ### TURN SPACE TO MIDDLE DOT in case FOR PG's TSVECTOR
    # return ' '.join(word.lower().replace(' ', '·') for word in text_list if isinstance(word, str))
    return ' '.join(word.lower() for word in text_list if isinstance(word, str))

def transform_entry(entry):
    ent_seq = entry.get("ent_seq")

    kanji_raw = [k for ele in entry.get("k_ele", []) for k in ele.get("keb", []) if isinstance(k, str)]
    reading_raw = [r for ele in entry.get("r_ele", []) for r in ele.get("reb", []) if isinstance(r, str)]

    meaning_raw = []
    for sense in entry.get("sense", []):
        for gloss in sense.get("gloss", []):
            text_list = gloss.get("text", [])
            if text_list and any(isinstance(t, str) for t in text_list):
                meaning_raw.extend(t for t in text_list if isinstance(t, str))

    new_entry = {
        "ent_seq": ent_seq,
        "all": transform_text_list(kanji_raw) + ' ' + transform_text_list(reading_raw) + ' ' + transform_text_list(meaning_raw),
        "k_ele": entry.get("k_ele", []),
        "r_ele": entry.get("r_ele", []),
        "sense": entry.get("sense", [])
    }

    return new_entry

def add_all_column(file_path: Path):

    # Load and transform the file
    with open(file_path.with_suffix(".json"), 'r', encoding='utf-8') as f:
        data = json.load(f)

    transformed_data = [transform_entry(entry) for entry in data]

    # Save the transformed output
    with open(file_path.with_suffix(".json"), 'w', encoding='utf-8') as out:
        json.dump(transformed_data, out, ensure_ascii=False, indent=2)


__all__ = ["add_all_column"]
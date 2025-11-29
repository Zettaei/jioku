import json
from pathlib import Path
from shared.utils.score_priority import score_priority
from shared.utils.score_nf import score_nf
from shared.utils.score_sort import score_sort

def transform_text_list(text_list):
    return [word.lower() for word in text_list if isinstance(word, str)]

def transform_entry(entry):
    ent_seq = entry.get("ent_seq")

    k_ele = entry.get("k_ele", [])
    r_ele = entry.get("r_ele", [])
    sense = entry.get("sense", [])

    pri_set = set()
    nf_set = set()

    for ele in k_ele:
        pri_set.update(ele.get("ke_pri", []))
    for ele in r_ele:
        pri_set.update(ele.get("re_pri", []))

    # Separate nf entries
    for p in list(pri_set):  # list() so we can modify pri_set safely
        if p.startswith("nf"):
            nf_set.add(p)
            pri_set.remove(p)
    
    pri = 0
    nf = 0
    pri += sum(score_priority(p) for p in pri_set)
    nf += sum(score_nf(nf) for nf in nf_set)

    # kanji_raw = []
    for ele in k_ele:
        keb_list = ele.get("keb", [])

        ele["keb"] = " ".join([k for k in keb_list if isinstance(k, str)])
        for elem in keb_list:
            if not isinstance(elem, str):
                continue
            ele["score"] = score_sort(len(elem), pri, nf)

  
        # kanji_raw.extend(keb_filtered)

    # reading_raw = []
    for ele in r_ele:
        reb_list = ele.get("reb", [])

        ele["reb"] = " ".join([r for r in reb_list if isinstance(r, str)])
        for elem in reb_list:
            if not isinstance(elem, str):
                continue
            ele["score"] = score_sort(len(elem), pri, nf)


        # reading_raw.extend(reb_filtered)

    # meaning_raw = []
    # for sense in entry.get("sense", []):
    #     for gloss in sense.get("gloss", []):
    #         text_list = gloss.get("text", [])
    #         if isinstance(text_list, list):
    #             meaning_raw.extend(t for t in text_list if isinstance(t, str))
    #         elif isinstance(text_list, str):
    #             meaning_raw.append(text_list)

    # all_flat = (
    #     transform_text_list(kanji_raw) +
    #     transform_text_list(reading_raw) +
    #     transform_text_list(meaning_raw)

    for s in sense:
        gloss_list = s.get("gloss", [])
        for g in gloss_list:
            text_list = g.get("text", [])

            g["text"] = [t for t in text_list if isinstance(t, str)]


    new_entry = {
        "ent_seq": ent_seq,
        # "all": all_flat,
        "k_ele": k_ele,
        "r_ele": r_ele,
        "sense": sense,
        "ent_score": score_sort(500, pri, nf)
    }

    return new_entry





def transform_for_redis(file_path: Path):

    # Load and transform the file
    with open(file_path.with_suffix(".json"), 'r', encoding='utf-8') as f:
        data = json.load(f)

    transformed_data = [transform_entry(entry) for entry in data]

    # Save the transformed output
    with open(file_path.with_suffix(".json"), 'w', encoding='utf-8') as out:
        json.dump(transformed_data, out, ensure_ascii=False, indent=2)


__all__ = ["transform_for_redis"]
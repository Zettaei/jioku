from lxml import etree
from pathlib import Path
import json
import re


def escape_all_entities(xml_chunk):
    return re.sub(r'&(?!(?:amp|lt|gt|quot|apos)\b)([a-zA-Z0-9_-]+);', r'&amp;\1;', xml_chunk)

def parse_entry(entry):
    entry_json = {}
    for child in entry:
        if child.tag == 'ent_seq':
            entry_json['ent_seq'] = child.text
        elif child.tag in ['k_ele', 'r_ele']:
            ele = {}
            for sub in child:
                ele.setdefault(sub.tag, []).append(sub.text)
            entry_json.setdefault(child.tag, []).append(ele)
        elif child.tag == 'sense':
            sense_obj = {}
            gloss_blocks = []
            for sub in child:
                if sub.tag == 'pos':
                    sense_obj.setdefault('pos', []).append(sub.text)
                elif sub.tag == 'gloss':
                    lang = sub.attrib.get('{http://www.w3.org/XML/1998/namespace}lang', 'eng')
                    found = False
                    for g in gloss_blocks:
                        if g.get('lang') == lang:
                            g['text'].append(sub.text)
                            found = True
                            break
                    if not found:
                        gloss_blocks.append({'lang': lang, 'text': [sub.text]})
            if gloss_blocks:
                sense_obj['gloss'] = gloss_blocks
            entry_json.setdefault('sense', []).append(sense_obj)
    return entry_json

def parse_jmdict_stream(file_path, limit=None):
    entries = []
    buffer = []
    inside_entry = False
    count = 0

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if '<entry>' in line:
                inside_entry = True
                buffer = [line]
            elif '</entry>' in line:
                buffer.append(line)
                inside_entry = False
                xml_chunk = ''.join(buffer)
                xml_chunk = escape_all_entities(xml_chunk)
                try:
                    parser = etree.XMLParser(recover=True)
                    entry = etree.fromstring(xml_chunk.encode(), parser=parser)
                    entries.append(parse_entry(entry))
                    count += 1
                    if limit and count >= limit:
                        break
                except Exception as e:
                    print(f"Still failed: {e}")
            elif inside_entry:
                buffer.append(line)
    return entries

def parse_data_to_json(file_path: Path):
    parsed_entries = parse_jmdict_stream(file_path)
    with open(file_path.with_suffix(".json"), 'w', encoding='utf-8') as out:
        json.dump(parsed_entries, out, ensure_ascii=False, indent=2)


__all__ = ["parse_data_to_json"]
# # Example usage
# parsed_entries = parse_jmdict_stream('JMdict_e')
# with open('jmdict.json', 'w', encoding='utf-8') as out:
#     json.dump(parsed_entries, out, ensure_ascii=False, indent=2)
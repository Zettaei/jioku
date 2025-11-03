import re
import json
import config
from pathlib import Path

def parse_metadata_to_json(file_path: Path):

    metadata = {}

    # Open the XML and search for the creation comment
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            match = re.search(r'<!--\s*JMdict created:\s*(.*?)\s*-->', line)
            if match:
                metadata["created"] = match.group(1)
                break  # stop after finding the first match

    # Construct output JSON path
    output_path = file_path.parent / f"{config.DICT_FILENAME}_metadata"

    # Save metadata to JSON
    with open(output_path.with_suffix(".json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4, ensure_ascii=False)
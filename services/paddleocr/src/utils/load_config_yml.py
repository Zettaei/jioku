from pathlib import Path
from yaml import safe_load


def load_config_yml(app_env: str):
    config_yml_path = Path(__file__).resolve().parents[2] / "config.yml" 
    with open(config_yml_path, 'r', encoding="utf-8") as f:
        return safe_load(f)[app_env]
    
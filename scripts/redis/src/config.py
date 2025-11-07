from pathlib import Path
from yaml import safe_load

config_yml_path = Path(__file__).resolve().parents[1] / "config.yml" 
with open(config_yml_path, "r", encoding="utf-8") as f:
    config = safe_load(f)

__all__ = ["config"]
## Dictionary Requirement

This script is designed to work **only with the JMdict_e file** (English version of JMdict).  
It may also work with the original JMdict (Japanese version), but only JMdict_e has been tested.

- You must download the latest `JMdict_e` XML file from [JMdict/EDICT project](http://www.edrdg.org/jmdict/j_jmdict.html).
- Place the file at the location specified in `config.yml` under `dict.file_path`.
- The script will parse this dictionary and insert its data into Redis.

⚠️ Using any other dictionary format may cause errors.
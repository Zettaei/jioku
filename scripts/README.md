# W H A T
This is the seeding app to parse and seed the **JMdict(English)** dictionary.

# W H Y
Parsing **JMdict(English)** XML file into json and seed it to the **Redis Stack**.

# H O W
> *You must already have installed Python version 3.9 or newer*

## 1. Get the Dictionary
This script is designed to work **only with the JMdict_e file** (English version of JMdict).  
***Note**: It may also work with the original JMdict (Japanese version), but only JMdict_e has been tested.*

- **Download:** the latest `JMdict_e` XML file from JMdict/EDICT project [here](http://www.edrdg.org/jmdict/j_jmdict.html).
- **Placement:** Place the file at the path specified in `config.yml` under `dict.file_path`.  
(default is `/dict/JMdict_e`, the `JMdict_e` is the file name)

## 2. Setup the environment
> *if you haven't install Redis Stack do it, go do it [here](../services/redis/README.md)*

### for Windows
- simply run the `runSeeding.bat` it should do everything and proceed to the seeding app

### for Linux (or if you can run Makefile)
- enter this script in the terminal  
`make run`  
it should do everything and proceed to the seeding app  
***Note:** If lxml fails to install, you may need to install library headers:
`libxml2-dev` `libxslt-dev` (probably...)*

## 3. Running the Seeding app
> *You must already have Redis Stack installed and is now running*

- the methods in [Setup the environment](#2-setup-the-environment) will start the app and can be run as many time as desire without any consequence since everything already installed
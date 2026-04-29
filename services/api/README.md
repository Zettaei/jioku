*You must already have installed Docker on your device*  
*You must already have setup Supabase with all the tables/columns ready*


# Setup
Setting up [Environment Variables](#environment-variables).  

After setting up env, there are 2 ways to build and run
[docker-compose](#docker-compose) and [Dockerfile](#dockerfile).
**Please choose either Docker Compose or standalone Dockerfile for your workflow. Using both simultaneously may result in configuration conflicts.**.

## docker-compose (easier way)
go to [docker-compose.md](../../docker-compose.md).

## Dockerfile
build image with this script  
`docker build -t {tag_name} .`  
*example: `docker build -t jioku_api:latest .`*

then run with this script  
`docker run --env-file .env {tag_name}`  
*example: `docker run --env-file .env jioku_api`*

other basic commands: [docker cheatsheet](https://docs.docker.com/get-started/docker_cheatsheet.pdf).


# Environment Variables
copy and rename the .env.example file or make a new file named `.env`  
and put these Environment Variables in

| **Name**                  | **Description**                                              | **Example**                                                       |
|---------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
| FRONTEND_URL              | Frontend server/client URL this server will talk to          | `http://localhost:3000`                                           |
| OCR_URL                   | URL of the OCR service                                       | `http://localhost:8000`                                           |
| OCR_API_KEY               | API key for the OCR service                                  | `your-ocr-api-key`                                                |
| REDISSTACK_URL            | Redis Stack connection URL                                   | `redis://localhost:6379`                                          |
| REDISSTACK_USERNAME       | Redis Stack username                                         | `default`                                                         |
| REDISSTACK_PASSWORD       | Redis Stack password                                         | `your-redis-password`                                             |
| SUPABASE_URL              | Supabase project URL                                         | `https://xyz.supabase.co`                                         |
| SUPABASE_SERVICE_KEY      | Supabase service role key                                    | `your-service-key`                                                |
| SUPABASE_DBNAME           | Supabase database schema name                                | `public`                                                          |
| AZURE_TRANSLATOR_URL      | Azure Cognitive Translator endpoint URL                      | `https://api.cognitive.microsofttranslator.com`                   |
| AZURE_TRANSLATOR_KEY      | Azure Translator API key                                     | `your-translator-key`                                             |
| AZURE_TRANSLATOR_REGION   | Azure Translator resource region                             | `eastus`                                                          |
| AZURE_SPEECH_TOKEN_URL    | Azure Speech token endpoint URL                              | `https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken`  |
| AZURE_SPEECH_KEY          | Azure Speech service API key                                 | `your-speech-key`                                                 |
| AZURE_TTS_URL             | Azure Text-to-Speech endpoint URL                            | `https://eastus.tts.speech.microsoft.com`                         |
| AZURE_STT_URL             | Azure Speech-to-Text endpoint URL                            | `https://eastus.stt.speech.microsoft.com`                         |


# P.S. types for Supabase
run the script below to get the Supabase types.  
`npx supabase gen types typescript --schema "{schema_names_seperated_with_comma}" --project-id {project_id} > src/core/supabase/generatedTypes.ts`
# W H A T    I S    T H I S
JIOKU is a full system backend/frontend, services web application about Japanese-English(mainly) with flashcard system to help users remember new vocabs.


# H O W    T O    S E T U P

## 1. External Services
- Create a project in Supabase at https://supabase.com/ 
with these option enabled
- Create a resource at https://portal.azure.com using **Translators** and **Speech services**

## 2. Setting Supabase Schema
do the step in [schema/README.md](schema/README.md).

## 3. Setting Dictionary
do the step in [scripts/README.md](scripts/README.md)

## 4. Final Step and Start
There are 2 ways for this part
1. docker-compose (easier)
2. Dockerfile  

**if you want to use docker-compose** do everything in [docker-compose.md](docker-compose.md) and finish without having to do the below part.

if not then go and do these:
- API: [/api/README.md](/services/api/README.md)
- Frontend: [/frontend/README.md](/services/frontend/README.md)
- PaddleOCR: [/paddleocr/README.md](/services/paddleocr/README.md)
- Redis Stack: [/redis/README.md](/services/redis/README.md)

## EXAMPLE BUILD
docker build -t redisstack

## EXAMPLE CREATE VOLUMES
redis volume create redis_data

## EXAMPLE RUN
### first -p is port for Redis
docker run --rm -it redisstack -p 6379:6379 -v redis_data:/data --env-file .env

## EXAMPLE BUILD
docker build -t redisstack

## EXAMPLE CREATE VOLUMES
redis volume create redis_data

## EXAMPLE RUN
### first -p is port for Redis
### second -p is port for RedisInsight
docker run --rm -it redisstack -p 6379:6379 -p 8001:8001 -v redis_data:/var/lib/redis/data --env-file .env


### TO REMIND MYSELF
*There are some problems with redis-stack and using non-root user so it's probably a good idea to split to*
*redis-stack-server AND redis-insight someday instead of this two in one*
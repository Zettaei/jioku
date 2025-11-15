
# redis/redis-stack:7.4.0-v8 (include RedisInsight)
FROM redis/redis-stack@sha256:880df9c228597cb0d15b585f39a4327d6ee2d8b0d0f155e3f75dba9a761d4ec3

# redis/redis-stack-server:7.4.0-v8 (exclude RedisInsight)
# FROM redis/redis-stack@sha256:39adcbb083b240642cd5738a75c4959c0393ef2a40fa545f2e1c7b55798eeda4

# first is Redis, second is RedisInsight
EXPOSE 6379
EXPOSE 8001

COPY ./redis.conf /usr/local/etc/redis/redis.conf

RUN groupadd -g 6379 redis && \
    useradd -u 6379 -g redis redisstack && \
    mkdir -p /var/lib/redis/data /usr/local/etc/redis /redisinsight/logs && \
    chown -R redisstack:redis /var/lib/redis/data /redisinsight/logs && \
    chmod -R 750 /var/lib/redis/data /usr/local/etc/redis /redisinsight/logs


VOLUME [ "/var/lib/redis/data" ]

# using non-root user will make RedisInsight not accessible
# USER redisstack

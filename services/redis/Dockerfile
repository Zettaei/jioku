
# redis/redis-stack-server:7.4.0-v8
FROM redis/redis-stack-server@sha256:39adcbb083b240642cd5738a75c4959c0393ef2a40fa545f2e1c7b55798eeda4

EXPOSE 6379

COPY redis.conf /usr/local/etc/redis/redis.conf
    
VOLUME [ "/data" ]

RUN useradd -m redisstack && \
    mkdir -p /data /usr/local/etc/redis && \
    chown -R redisstack:redisstack /data /usr/local/etc/redis && \
    chmod -R 755 /usr/local/etc/redis && \
    chmod -R 750 /data

USER redisstack

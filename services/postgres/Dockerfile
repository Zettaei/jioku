
# postgres:15.15-alpine3.22
FROM postgres@sha256:89591860e36c50a660384d075ce684a48a0927a450f71a7f17b59eb2c4eb55cd

EXPOSE 8080

VOLUME [ "/var/lib/postgresql" ]

# postgres already has user "postgres", I think
RUN mkdir -p /var/lib/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql && \
    chmod -R 750 /var/lib/postgresql

USER postgres
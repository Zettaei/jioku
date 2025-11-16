#!/bin/bash
chown -R paddleocr:paddleocr /app/logs /app/tmp /home/paddleocr/.paddlex

exec "$@"
# python:3.10.19-slim
FROM python@sha256:b596083aa14d47c78a652138aa9b98607585499d7c7ec343ae378f6c5770822d

WORKDIR /app

# EXPOSE ACTUALLY DO NOTHING — IT JUST HINT THAT THE APP USE ON PORT 8866 INTERNALLY
EXPOSE 8866

RUN apt-get update && \
    apt-get install -y libgl1 libglib2.0-0 libgomp1

RUN useradd -u 1001 -m paddleocr && \
    mkdir -p /app/logs /app/tmp /home/paddleocr/.paddlex/temp

COPY requirements.txt .
RUN python -m pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R paddleocr:paddleocr /app/logs /app/tmp && \
    chmod -R 750 /app/logs /app/tmp


VOLUME ["/app/logs", "/home/paddleocr/.paddlex"]

USER paddleocr

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8866"]

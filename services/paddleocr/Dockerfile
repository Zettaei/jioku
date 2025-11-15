# python:3.10.19-slim
FROM python@sha256:b596083aa14d47c78a652138aa9b98607585499d7c7ec343ae378f6c5770822d

WORKDIR /app

# EXPOSE ACTUALLY DO NOTHING — IT JUST HINT THAT THE APP USE ON PORT 8000 INTERNALLY
EXPOSE 8000

RUN apt-get update && \
    apt-get install -y libgl1 libglib2.0-0 libgomp1

RUN groupadd -g 1001 paddleocr && \
    useradd -u 1001 -g paddleocr -m ocr
RUN mkdir -p /app/logs /app/tmp /home/ocr/.paddlex/temp

###
COPY requirements.txt .
RUN python -m pip install --no-cache-dir --upgrade pip 
RUN pip install --no-cache-dir -r requirements.txt

# COPY docker-entrypoint.sh /paddleocr/docker-entrypoint.sh
# RUN chmod 550 /paddleocr/docker-entrypoint.sh

###
COPY . .
RUN chown -R ocr:paddleocr /app/logs /app/tmp /home/ocr/.paddlex && \
    chmod -R 755 /app/logs /app/tmp /home/ocr/.paddlex


VOLUME ["/app/logs", "/app/tmp", "/home/ocr/.paddlex"]

# # ENTRYPOINT WILL RUN AFTER VOLUMES HAVE BEEN MOUNTED
# USER root
# ENTRYPOINT [ "/paddleocr/docker-entrypoint.sh" ]
USER ocr

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

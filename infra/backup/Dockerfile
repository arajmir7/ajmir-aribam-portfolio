FROM postgres:17-alpine
RUN apk add --no-cache aws-cli python3
WORKDIR /app
COPY scripts/backup_postgres.py scripts/restore_postgres.py ./
USER postgres
CMD ["python3", "/app/backup_postgres.py"]

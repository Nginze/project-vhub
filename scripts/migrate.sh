#!/bin/bash

# Load environment variables from .env.production and .env.development
source /home/nginze/Documents/vhub/.env

# Ask for environment
echo "Choose environment (development/production):"
read ENV

# PostgreSQL
echo "Dumping local PostgreSQL database..."
pg_dump -h $LOCAL_PGHOST -p $LOCAL_PGPORT -U $LOCAL_PGUSER -d $LOCAL_PGDATABASE > db_dump.sql

if [ "$ENV" = "production" ]; then
    echo "Copying PostgreSQL dump to remote server..."
    scp -i $REMOTE_SSH_KEY db_dump.sql $REMOTE_USER@$REMOTE_IP:/tmp/db_dump.sql

    echo "Copying PostgreSQL dump to Docker container on remote server..."
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker cp /tmp/db_dump.sql $POSTGRES_HOST:/db_dump.sql"

    echo "Dropping old database if it exists..."
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c \"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$PGDATABASE' AND pid <> pg_backend_pid();\""
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c \"DROP DATABASE IF EXISTS $PGDATABASE;\""

    echo "Creating new Docker database..."
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c \"CREATE DATABASE $PGDATABASE\""

    echo "Importing PostgreSQL dump into Docker database..."
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker exec $POSTGRES_HOST psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f /db_dump.sql"

    echo "Removing dump files..."
    rm db_dump.sql
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "docker exec $POSTGRES_HOST rm /db_dump.sql"
else
    echo "Copying PostgreSQL dump to Docker container..."
    docker cp db_dump.sql $POSTGRES_HOST:/db_dump.sql

    echo "Dropping old database if it exists..."
    docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$PGDATABASE' AND pid <> pg_backend_pid();"
    docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c "DROP DATABASE IF EXISTS $PGDATABASE;"

    echo "Creating new Docker database..."
    docker exec $POSTGRES_HOST psql -U $PGUSER -d postgres -c "CREATE DATABASE $PGDATABASE"

    echo "Importing PostgreSQL dump into Docker database..."
    docker exec $POSTGRES_HOST psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f /db_dump.sql

    echo "Removing dump files..."
    rm db_dump.sql
    docker exec $POSTGRES_HOST rm /db_dump.sql
fi


if [ "$ENV" = "production" ]; then
    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_IP "rm /tmp/db_dump.sql"
fi
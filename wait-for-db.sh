#!/bin/bash

set -e

until pg_isready -h "postgres" -U "$POSTGRES_USER"; do
  echo "Postgres is unavailable - sleeping {$POSTGRES_USER}"
  sleep 1
done

echo "Postgres is up - executing command"
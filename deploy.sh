#!/bin/bash
set -e
cd "$(dirname "$0")"

[ -f .env ] || { echo "Missing .env — copy .env.example to .env and fill in secrets"; exit 1; }

docker compose -f docker-compose.prod.yml up -d --build certbot
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec -T backend npm run migrate

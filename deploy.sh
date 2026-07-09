#!/bin/bash
set -e
cd "$(dirname "$0")"

[ -f .env ] || { echo "Missing .env — copy .env.example to .env and fill in secrets"; exit 1; }

docker compose -f docker-compose.prod.yml up -d --build server backend

echo "Waiting for nginx to be ready..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost 2>/dev/null; then
    echo "Nginx is ready."
    break
  fi
  sleep 2
done

if [ ! -d ./ssl/live/unify-social.app ]; then
  echo "Requesting Let's Encrypt certificate..."
  docker compose -f docker-compose.prod.yml run --rm --entrypoint "" \
    certbot /bin/sh -c "
      certbot certonly --webroot -w /var/www/certbot \
        -d unify-social.app -d api.unify-social.app \
        --email admin@unify-social.app --agree-tos --non-interactive \
        --register-unsafely-without-email || true
    "
  docker compose -f docker-compose.prod.yml exec -T server nginx -s reload 2>/dev/null || true
fi

echo "Starting certbot renewal daemon..."
docker compose -f docker-compose.prod.yml up -d certbot

docker compose -f docker-compose.prod.yml exec -T backend npm run migrate

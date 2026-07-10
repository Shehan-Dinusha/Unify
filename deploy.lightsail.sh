#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

[ -f .env ] || { echo "Missing .env - copy .env.example to .env and fill in secrets"; exit 1; }
: "${BACKEND_IMAGE:?BACKEND_IMAGE is required}"
: "${SERVER_IMAGE:?SERVER_IMAGE is required}"

echo "Stopping old stack if it exists..."
docker compose -f docker-compose.lightsail.yml down --remove-orphans >/dev/null 2>&1 || true

echo "Clearing unused Docker cache from previous deploys..."
docker builder prune -af >/dev/null 2>&1 || true
docker image prune -af >/dev/null 2>&1 || true

if [ -n "${GHCR_USERNAME:-}" ] && [ -n "${GHCR_TOKEN:-}" ]; then
  echo "Logging in to ghcr.io..."
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
fi

echo "Pulling prebuilt images..."
docker compose -f docker-compose.lightsail.yml pull backend server

echo "Starting backend and server containers..."
docker compose -f docker-compose.lightsail.yml up -d backend server

echo "Waiting for backend to accept migrations..."
for i in $(seq 1 30); do
  if docker compose -f docker-compose.lightsail.yml exec -T backend node -e "process.exit(0)" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "Running database migrations..."
docker compose -f docker-compose.lightsail.yml exec -T backend npm run migrate

echo "Waiting for backend health check..."
for i in $(seq 1 30); do
  if docker compose -f docker-compose.lightsail.yml exec -T backend node -e "fetch('http://127.0.0.1:5000/health').then(async (res) => { if (!res.ok) process.exit(1); process.exit(0); }).catch(() => process.exit(1))" >/dev/null 2>&1; then
    echo "Backend is healthy."
    break
  fi
  sleep 2
done

if ! docker compose -f docker-compose.lightsail.yml exec -T backend node -e "fetch('http://127.0.0.1:5000/health').then(async (res) => { if (!res.ok) process.exit(1); process.exit(0); }).catch(() => process.exit(1))" >/dev/null 2>&1; then
  echo "Backend health check failed."
  exit 1
fi

CERT_FILE=./ssl/live/unify-social.app/fullchain.pem
NEEDS_LETSENCRYPT=0

if [ ! -f "$CERT_FILE" ]; then
  NEEDS_LETSENCRYPT=1
elif ! openssl x509 -in "$CERT_FILE" -noout -issuer 2>/dev/null | grep -qi "Let's Encrypt"; then
  NEEDS_LETSENCRYPT=1
fi

if [ "$NEEDS_LETSENCRYPT" -eq 1 ]; then
  echo "Requesting or replacing Let's Encrypt certificate..."
  docker compose -f docker-compose.lightsail.yml run --rm --entrypoint "" \
    certbot /bin/sh -c "
      certbot certonly --webroot -w /var/www/certbot \
        --cert-name unify-social.app \
        -d unify-social.app -d api.unify-social.app \
        --email admin@unify-social.app --agree-tos --non-interactive \
        --register-unsafely-without-email --force-renewal || true
    "
  docker compose -f docker-compose.lightsail.yml exec -T server nginx -s reload 2>/dev/null || true
fi

echo "Starting certbot renewal container..."
docker compose -f docker-compose.lightsail.yml up -d certbot

echo "Pruning dangling images..."
docker image prune -f >/dev/null 2>&1 || true

echo "Deployment complete."

#!/bin/sh
set -e

CERT_DIR=/etc/letsencrypt/live/unify-social.app

if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" -days 1 \
    -subj "/CN=unify-social.app"
fi

exec nginx -g "daemon off;"

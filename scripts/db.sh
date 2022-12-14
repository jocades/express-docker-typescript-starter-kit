#!/usr/bin/env bash
set -e

function clean() {
    docker-compose -f docker/docker-compose.db.yml down
    trap '' EXIT INT TERM
    exit $err
}

trap clean SIGINT EXIT

# Make sure docker-compose is installed
if ! hash docker-compose 2>/dev/null; then
  echo -e '\033[0;31mPlease install docker-compose\033[0m'
  exit 1
fi

if [ -z "$(docker network ls -qf name=^entropic$)" ]; then
  echo "Creating network"
  docker network create entropic >/dev/null
fi

# Run mongo container
COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker/docker-compose.db.yml up -d --force-recreate

# Run server locally
npm run dev

#!/usr/bin/env bash
set -e

function clean() {
    docker-compose -f docker-compose.dev.yml down
    trap '' EXIT INT TERM
    exit $err
}

trap clean SIGINT EXIT

if ! hash docker-compose 2>/dev/null; then
    echo -e '\033[0;31mPlease install docker-compose\033[0m'
    exit 1
fi

docker-compose -f docker-compose.dev.yml up --force-recreate

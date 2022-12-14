#!/usr/bin/env bash
set -e

function clean() {
    docker-compose -f docker-compose.dev.yml down
    trap '' EXIT INT TERM
    exit $err
}

trap clean SIGINT EXIT

# Run the container
docker-compose -f docker-compose.dev.yml up
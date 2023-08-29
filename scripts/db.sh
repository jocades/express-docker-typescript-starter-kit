#!/usr/bin/env bash
set -e

function clean() {
    docker stop mongo
    trap '' EXIT INT TERM
    exit $err
}

trap clean SIGINT EXIT

docker run --rm -d -p 27017:27017 -h $(hostname) -v $(pwd)/data:/data/db --name mongo mongo:5.0.3 --replSet=test &&
    sleep 4 &&
    docker exec mongo mongo --eval "rs.initiate();" --quiet


npm run dev

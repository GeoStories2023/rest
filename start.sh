#!/bin/bash
git pull
docker compose down --remove-orphans
docker compose up --build -d


while getopts l: flag
do
    case "${flag}" in
        l) log=${OPTARG};;
    esac
docker logs -f gs_${log}
done


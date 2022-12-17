#!/usr/bin/env bash
set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
  echo -e "\e[32m dist folder deleted \e[0m"
else
  echo -e "\e[31m dist folder does not exist \e[0m"
fi

if [ -d "./logs" ]; then
  rm -rf ./logs
  echo -e "\e[32m logs folder deleted \e[0m"
else
  echo -e "\e[31m logs folder does not exist \e[0m"
fi

if [ -d "./coverage" ]; then
  rm -rf ./coverage
  echo -e "\e[32m coverage folder deleted \e[0m"
else
  echo -e "\e[31m coverage folder does not exist \e[0m"
fi

#!/bin/bash
set -ex

echo "Setup and Upgrade 8dito"
pwd
cd $1
git status
git pull
npm install
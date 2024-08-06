#!/bin/bash

source .env

#setup ssh
./scripts/install_ssl.sh

# Load environment variables from .env.production
docker compose --env-file .env up -d

# Change directory to webrtc-server
cd webrtc-server

# Compile the typescript files
pnpm tsc

# Start the production server
pnpm start:prod



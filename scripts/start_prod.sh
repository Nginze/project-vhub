#!/bin/bash

#setup ssh
./scripts/install_ssl.sh

# Load environment variables from .env.production
docker-compose --env-file .env.production up -d

# Change directory to webrtc-server
cd webrtc-server

# Compile the typescript files
pnpm tsc

# Start the production server
pnpm start:prod



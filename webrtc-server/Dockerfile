FROM node:20

WORKDIR /app

COPY webrtc-server/package*.json ./

COPY webrtc-server .

COPY shared /shared

RUN npm install -g pnpm

RUN pnpm install

RUN apt-get update && apt-get install -y \
    build-essential \
    python3

RUN pnpm tsc

RUN npm install -g pm2

EXPOSE 3000

CMD ["pnpm", "start:prod"]
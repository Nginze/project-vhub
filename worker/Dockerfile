FROM node:20

WORKDIR /app

COPY worker/package*.json worker/pnpm-lock.yaml ./

COPY worker .

COPY shared /shared

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm tsc

RUN npm install -g pm2

CMD ["pnpm", "start:prod"]
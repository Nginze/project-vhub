FROM node:20

WORKDIR /app

COPY server/package*.json server/pnpm-lock.yaml ./

COPY server .

COPY shared /shared

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm tsc

RUN npm install -g pm2

EXPOSE 8080

CMD ["pnpm", "start:prod"]
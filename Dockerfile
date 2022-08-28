FROM node:16-alpine

RUN corepack enable && corepack prepare pnpm@7.9.5 --activate

WORKDIR /usr/src/website

COPY . .

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "watch"]
FROM node:current-alpine

WORKDIR /usr/app/client_web

RUN apk update && npm install -g pnpm && pnpm install vite --save-dev

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 8081

CMD ["pnpm", "run", "dev", "--host", "0.0.0.0", "--port", "8081"]
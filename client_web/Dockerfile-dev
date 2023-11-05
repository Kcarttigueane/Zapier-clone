FROM node:20-alpine

WORKDIR /usr/app/client_web

RUN npm install -g pnpm && pnpm install vite --save-dev

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 8081

CMD ["sh", "-c", "cp /build/app-release.apk /usr/app/client_web/public/client.apk && pnpm run dev --host 0.0.0.0 --port 8081"]
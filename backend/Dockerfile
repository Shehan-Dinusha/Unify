FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]

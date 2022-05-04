# Dependencies
# ---------------------------------------------------------
FROM node:16-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Application
# ---------------------------------------------------------
FROM node:16-alpine

ARG port=8000
ARG client_port=3000

ENV PORT=$port
ENV CLIENT_PORT=$client_port

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

EXPOSE $port
CMD ["npm", "run", "start"]

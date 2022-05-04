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

ARG port=3000
ARG api_port=8000

ENV PORT=$port
ENV REACT_APP_API_PORT=$api_port

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

EXPOSE $port
CMD ["npm", "run", "start"]

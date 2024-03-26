FROM node:20-alpine3.16 AS dev

WORKDIR /app

COPY . .

RUN npm i

FROM node:20-alpine3.16 AS prod

WORKDIR /app

COPY . .

RUN npm i

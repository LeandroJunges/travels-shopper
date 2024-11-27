
FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app


COPY package.json yarn.lock ./


RUN yarn install

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma

RUN yarn build

EXPOSE 8080


CMD ["yarn", "start"]


FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app


COPY package.json yarn.lock ./


RUN yarn install

COPY tsconfig.* ./

COPY prisma ./prisma

COPY src ./src

RUN npx prisma generate 

RUN yarn build

EXPOSE 8080

CMD ["sh", "-c", "yarn prisma:seed && yarn start"]


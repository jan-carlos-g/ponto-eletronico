FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD npx prisma migrate deploy && yarn start && yarn seed

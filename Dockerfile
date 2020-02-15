# FROM node:alpine
FROM frolvlad/alpine-glibc

RUN apk update && apk add nodejs yarn openssl python g++ make && rm -rf /var/cache/apk/*

ENV APP_DIR /app

WORKDIR ${APP_DIR}

# RUN apt-get update && apt-get install nano

COPY package.json ${APP_DIR}
COPY yarn.lock ${APP_DIR}

RUN yarn install --production

COPY . .

RUN yarn generate

EXPOSE 4000

ENV HOST 0.0.0.0

CMD ["yarn", "start"]

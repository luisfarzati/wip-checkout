FROM node:12-alpine

ENV NODE_ENV production
ENV HTTP_PORT 80

WORKDIR /opt/app
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile

COPY bin/ ./bin
COPY lib/ ./lib

CMD ["node", "bin/start"]

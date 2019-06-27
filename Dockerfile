# build using :             docker build -t span-challenge-nodejs -f Dockerfile .
# run using :               docker run -d -v src:/usr/src/src --name span-challenge-nodejs span-challenge-nodejs

FROM node:8.9.4-alpine

RUN npm install -g \
    yarn \
    gulp \
    mocha \
    ts-node \
    typescript

RUN mkdir -p /usr/src

WORKDIR /usr/src

COPY package.json /usr/src/

RUN yarn install

COPY . /usr/src

RUN gulp

WORKDIR /usr/src/dist

CMD tail -f /dev/null
# build using :             docker build -t span-challenge-nodejs -f Dockerfile .
# run using :               docker run -d -v src:/usr/src/src --name span-challenge-nodejs span-challenge-nodejs

FROM node:8.9.4-alpine

RUN npm install -g gulp

RUN mkdir -p /usr/src

WORKDIR /usr/src

COPY package.json /usr/src/

RUN npm install

COPY . /usr/src

RUN gulp

WORKDIR /usr/src/dist

CMD tail -f /dev/null
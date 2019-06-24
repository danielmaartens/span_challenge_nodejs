# TODO CHANGE ME
# build using :             docker build -t span-challenge-nodejs -f Dockerfile .
# run using :               docker run -d -v src:/usr/src/src span-challenge-nodejs

FROM node:8.9.4-alpine

RUN npm install -g \
    gulp \
    pm2

RUN mkdir -p /usr/src

WORKDIR /usr/src

COPY package.json /usr/src/

RUN npm install

COPY . /usr/src

RUN gulp

RUN rm -r src docker

WORKDIR /usr/src/dist

CMD ["gulp"]
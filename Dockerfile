FROM node:16

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

ENV MONGO_URL=mongodb://mongo:27017/test

EXPOSE 8000

CMD ["npm", "run", "dev"]


FROM node:23-alpine

COPY package.json /app/
COPY package-lock.json /app/
COPY server.js /app/
COPY controllers /app/controllers/

WORKDIR /app

RUN npm install

CMD ["node", "server.js"]
FROM node:18.17-alpine

WORKDIR /var/www/html

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
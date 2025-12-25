FROM node:20-alpine

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install --production

# copy app
COPY . .

ENV PORT=4001
EXPOSE 4001

CMD ["node", "server.js"]

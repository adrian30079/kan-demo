FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm update && npm install
COPY . .

CMD ["npm", "run", "dev"]
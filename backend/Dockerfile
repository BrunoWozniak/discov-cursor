FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev knex pg
COPY . .
CMD ["npm", "run", "dev"] 
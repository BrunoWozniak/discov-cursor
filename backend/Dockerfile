FROM node:18 AS app
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev knex pg
RUN npm install --include=dev jest supertest
RUN npm install --include=dev newman
RUN npm install --include=dev jest-junit
RUN mkdir -p /app/test-results /app/coverage
COPY . .
CMD ["npm", "start"] 
# --- Test stage ---
FROM node:18 AS test
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev knex pg jest supertest jest-junit
COPY . .
CMD ["npm", "test"] 
# --- API Test stage ---
FROM node:18 AS test-api
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev knex pg jest supertest newman jest-junit
COPY . .
CMD ["npm", "run", "test:api"] 
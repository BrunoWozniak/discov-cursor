FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest
RUN npm install --include=dev cypress
RUN npm install --include=dev jest-junit
COPY . .
CMD ["npm", "start"]
# --- Test stage ---
FROM node:18 AS test
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest
COPY . .
CMD ["npm", "test"]
# --- E2E Test stage ---
FROM node:18 AS test-e2e
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest cypress
COPY . .
CMD ["npm", "run", "test:e2e"] 
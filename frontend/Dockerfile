FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest
RUN npm install --include=dev cypress
RUN npm install --include=dev jest-junit
RUN npm install --include=dev @babel/core @babel/preset-env @babel/preset-react babel-jest
RUN npm install --include=dev identity-obj-proxy
COPY . .
CMD ["npm", "start"]
# --- Test stage ---
FROM node:18 AS test
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest jest-junit @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy
COPY . .
CMD ["npm", "test"]
# --- E2E Test stage ---
FROM cypress/included:14.5.2 AS test-e2e
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
CMD ["npm", "run", "test:e2e"] 
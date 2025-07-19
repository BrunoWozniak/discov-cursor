# Default stage - React dev server
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest cypress jest-junit @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy wait-on
RUN mkdir -p /app/test-results /app/coverage
COPY . .
CMD ["npm", "start"]

# Test stage - Jest unit tests
FROM node:18 AS test
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev @testing-library/react @testing-library/jest-dom jest jest-junit @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy wait-on
COPY . .
CMD ["npm", "test"]

# E2E Test stage - Cypress (multi-platform)
ARG CYPRESS_BASE
FROM node:18 AS test-e2e
WORKDIR /app
COPY package*.json ./
RUN if [ "$CYPRESS_BASE" = "cypress/included:14.5.2" ]; then \
      npm install --include=dev wait-on; \
    else \
      apt-get update && apt-get install -y \
        xvfb \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        libx11-xcb1 \
        libxkbcommon0 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxi6 \
        libxrandr2 \
        libxinerama1 \
        libxss1 \
        libappindicator3-1 \
        fonts-liberation \
        libappindicator1 \
        xdg-utils \
        && rm -rf /var/lib/apt/lists/*; \
      npm install --include=dev wait-on cypress; \
    fi
COPY . .
CMD ["npx", "cypress", "run", "--headless"]

# --- App (production build) stage ---
FROM node:18 AS app
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
ARG REACT_APP_API_URL
ARG HOMEPAGE
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN echo "Building with API URL: $REACT_APP_API_URL"
RUN echo "Building with HOMEPAGE: $HOMEPAGE"
COPY . .
RUN if [ -n "$HOMEPAGE" ]; then \
      sed -i "s|\"homepage\": \".*\"|\"homepage\": \"$HOMEPAGE\"|" package.json; \
    fi
RUN npm run build

# --- Production server ---
FROM nginx:alpine AS prod-server
COPY --from=app /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"] 
#!/bin/sh
npx wait-on http://frontend:3000
npm run test:e2e 
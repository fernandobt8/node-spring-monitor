FROM node:latest

COPY backend/build/ backend/build/
COPY backend/node_modules/ backend/node_modules/
COPY backend/package.json backend/package.json

COPY frontend/build/ frontend/build/

WORKDIR backend/

RUN yarn install

EXPOSE 8000
CMD [ "node", "build/index.js" ]
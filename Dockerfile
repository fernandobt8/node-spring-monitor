FROM node:22-slim as builder

COPY backend/ backend/
COPY frontend/ frontend/

RUN yarn --cwd backend install
RUN yarn --cwd backend build 

RUN yarn --cwd frontend install
RUN yarn --cwd frontend build

FROM node:22-slim

COPY --from=builder backend/dist/ ./

COPY --from=builder frontend/build/ static/

EXPOSE 8000
CMD [ "node", "./index.js" ]
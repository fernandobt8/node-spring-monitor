FROM node:22 as builder

COPY backend/ backend/
COPY frontend/ frontend/

RUN yarn --cwd backend install
RUN yarn --cwd backend build 

RUN yarn --cwd frontend install
RUN yarn --cwd frontend build

FROM node:22

COPY --from=builder backend/build/ ./
COPY --from=builder backend/node_modules/ node_modules/

COPY --from=builder frontend/build/ static/

EXPOSE 8000
CMD [ "node", "./index.js" ]
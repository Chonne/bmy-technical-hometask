FROM node:18 AS build
WORKDIR /home/node/app
COPY src /home/node/app/src
COPY package*.json \
    tsconfig.json \
    /home/node/app/
RUN npm ci
RUN npm run build
RUN npm prune production


FROM node:18-alpine AS prod
RUN apk --no-cache add dumb-init
USER node
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/node_modules /home/node/app/node_modules
COPY --chown=node:node --from=build /home/node/app/dist /home/node/app/dist
COPY --chown=node:node package.json /home/node/app
EXPOSE 3000
CMD [ "dumb-init", "node", "./dist/server.js" ]

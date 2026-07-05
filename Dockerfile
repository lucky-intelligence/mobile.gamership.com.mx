FROM node:22.12.0-alpine

RUN mkdir -p /app/node_modules && chown -R 1000:1000 /app

WORKDIR /app

COPY --chown=1000:1000 .npmrc package*.json ./
USER 1000
RUN --mount=type=secret,id=node_auth_token,uid=1000 \
    NODE_AUTH_TOKEN="$(cat /run/secrets/node_auth_token)" npm install
COPY --chown=1000:1000 . .
EXPOSE 4173
CMD ["npm", "start", "--", "--host"]
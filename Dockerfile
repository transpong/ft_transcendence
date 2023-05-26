FROM node:lts AS build

LABEL maintainer="Lury <lyuri-go@student.42sp.org.br>"

COPY . /app

WORKDIR /app

RUN npm ci --silent

RUN npm run build && rm -rf node_modules src

FROM node:lts

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app /app

RUN npm ci --omit=dev

RUN chown -R node:node /app

USER node

ENV TZ=America/Sao_Paulo

CMD ["npm","run", "start:prod", "--silent"]

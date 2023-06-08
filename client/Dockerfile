## Build ##
FROM node:lts AS build
LABEL maintainer="Lury <lyuri-go@student.42sp.org.br>"
COPY . /app
WORKDIR /app

ARG VITE_API_42_URL
ENV VITE_API_42_URL=${VITE_API_42_URL}

ARG VITE_API_42_CLIENT_ID
ENV VITE_API_42_CLIENT_ID=${VITE_API_42_CLIENT_ID}

ARG VITE_API_42_REDIRECT_URL
ENV VITE_API_42_REDIRECT_URL=${VITE_API_42_REDIRECT_URL}

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

## Script to create a env file inside the build image
RUN bash ./config/envit.sh

RUN npm ci --silent
RUN npm run build && rm -rf node_modules src


### Production ###
FROM node:lts
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app /app
RUN npm ci --omit=dev
RUN npm i -g vite
RUN chown -R node:node /app
USER node
ENV TZ=America/Sao_Paulo
CMD ["npm", "run", "preview"]

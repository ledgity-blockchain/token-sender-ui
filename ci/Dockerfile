# build environment
FROM node:14.15.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache add git
COPY package.json yarn.lock ./
COPY . .
RUN cp env.example.ts env.ts
RUN yarn
RUN cd client && yarn
RUN yarn hardhat compile
RUN yarn hardhat export --export-all client/src/deployments.json
RUN cd client && yarn build

# production environment
FROM nginx:stable-alpine
LABEL traefik.http.routers.token-sender.rule="Host(`tokensender.ledgity.com`)"
LABEL traefik.http.routers.token-sender.tls=true
LABEL traefik.http.routers.token-sender.tls.certresolver=lets-encrypt
LABEL traefik.port=80
COPY --from=build /app/client/dist /usr/share/nginx/html
#COPY ./ci/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

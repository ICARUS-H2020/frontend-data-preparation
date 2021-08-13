FROM node:12-alpine as bs

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

RUN npm install -g serve
WORKDIR /www
COPY --from=bs /app/dist/. ./
EXPOSE 8080
CMD [ "serve", "-l", "8080", "-s", "." ]
FROM node:alpine as builder
# In AWS the above won't work. Do:
# FROM node:alpine

WORKDIR /usr/app

COPY package.json ./
RUN yarn
# Note that if we use docker volumes and docker-compose, this may
# not be strictly necessary, but good to leave it in since this
# would be required with normal docker.
COPY ./ ./

RUN yarn build

FROM nginx
# AWS has a problem with this, too. Do --from=0
COPY --from=builder /usr/app/dist /usr/share/nginx/html
# Default command of nginx container will do the work for us.

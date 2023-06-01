# Use node alpine image as the base image.
# See why use alpine images: https://yeasy.gitbooks.io/docker_practice/cases/os/alpine.html
FROM node:9-alpine
MAINTAINER ZJUIDG

# WORKDIR is similar to "cd". The directory will be created if not exists.
WORKDIR /app

ADD package.json .
RUN npm install

# And then add your application.
ADD ./ ./

# Specify the command to run at image startup.
CMD ["npm", "start"]


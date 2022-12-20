FROM node:14

WORKDIR /badhan-web
RUN npm i -g npm
RUN npm install -g @vue/cli
RUN npm install -g firebase-tools

EXPOSE 8080
EXPOSE 9005
FROM node:14

WORKDIR /badhan-web
RUN apt-get update
RUN npm i -g npm
RUN npm install -g @vue/cli
RUN npm install -g http-server
CMD ["npm", "run", "serve"]
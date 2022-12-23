FROM node:14

WORKDIR /badhan-web
RUN npm i -g npm
RUN npm install -g @vue/cli
RUN npm install -g firebase-tools

EXPOSE 9005
CMD ["npm", "run", "serve"]
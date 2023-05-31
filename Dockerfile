FROM node:current-alpine3.17

# Create app directory
WORKDIR /usr/src/app

COPY ./*.json ./
COPY .env_docker .env
COPY *.ts .
COPY ./interfaces/* ./interfaces/
COPY ./lib/* ./lib/
COPY ./prisma/* ./prisma/
COPY ./routes/* ./routes/


RUN npm i --verbose
RUN npm run prisma

EXPOSE 3000

CMD [ "npm", "start" ]
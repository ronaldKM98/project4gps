FROM node:11

LABEL version="1.0"
LABEL description="Project 1 GPS"
LABEL maintainer="Camila White - cwhiter@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /project1GPS

COPY package*.json ./

RUN npm install 

COPY . ./

EXPOSE 3000
CMD npm start
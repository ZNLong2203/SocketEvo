FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma/schema.prisma ./

RUN npm install

RUN npx prisma generate 

COPY . .

EXPOSE 3005


CMD ["node", "index.js"]
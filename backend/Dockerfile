FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]
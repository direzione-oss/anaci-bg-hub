FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3017
ENV HOST=0.0.0.0

RUN npm run build

EXPOSE 3017

CMD ["npm", "start"]

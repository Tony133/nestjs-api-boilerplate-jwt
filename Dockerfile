FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]


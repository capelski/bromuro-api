FROM node:12.18-alpine
RUN mkdir -p /var/www/app
WORKDIR /var/www/app
COPY . .
RUN npm install --production
EXPOSE 80
CMD ["npm", "start"]
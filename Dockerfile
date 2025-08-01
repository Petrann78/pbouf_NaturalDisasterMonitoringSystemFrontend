FROM node:20.11-alpine AS base
WORKDIR /app
ARG BUILD_ENVIRONMENT=dev
RUN npm config set registry https://registry.npmjs.org/
COPY package*.json ./
RUN npm install --verbose
COPY . .
RUN npm run build:$BUILD_ENVIRONMENT

FROM nginx:1.27.0-alpine
COPY --from=base /app/dist /usr/share/nginx/html
COPY --from=base /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]
FROM node:20-alpine as build
RUN apk update

# GET CODE
WORKDIR /app
COPY ./src/web .
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
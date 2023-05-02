FROM alpine:3 as build
RUN apk update

# TOOLS
RUN apk add nodejs npm

# GET CODE
WORKDIR /app
COPY ./src/web .
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
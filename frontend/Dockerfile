FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json /app/
RUN npm ci

COPY . /app/
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

ENV PORT=10000
ENV VITE_API_BASE=

EXPOSE 10000

CMD ["sh", "-c", "printf \"window.__API_BASE__='%s';\\n\" \"$VITE_API_BASE\" > /app/dist/config.js && serve -s /app/dist -l ${PORT}"]

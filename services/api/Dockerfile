### BUILD STAGE

FROM node:lts-bookworm-slim AS BUILD_STAGE

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc


### PRODUCTION STAGE

# node:25.2.1-alpine3.22
FROM node@sha256:26ded7f450a0ad37241d2ae97ea521a59cb551a1785c8a950f74b0a291ad3aea AS PRODUCTION_STAGE

WORKDIR /app

COPY --from=BUILD_STAGE /app/dist ./dist
COPY package.json ./
COPY .env ./
RUN npm install --omit=dev

EXPOSE 8787

CMD ["node", "--env-file=.env", "dist/index.js"]
### BUILD STAGE

FROM node:lts-bookworm-slim AS build_stage

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


### PRODUCTION STAGE

# node:25.2.1-alpine3.22
FROM node@sha256:26ded7f450a0ad37241d2ae97ea521a59cb551a1785c8a950f74b0a291ad3aea AS production_stage

WORKDIR /app

COPY --from=build_stage /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 8787

USER node
CMD ["node", "dist/index.js"]

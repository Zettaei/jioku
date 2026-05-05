### BUILD STAGE
FROM node:lts-bookworm-slim AS build_stage

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

### PRODUCTION STAGE
FROM node@sha256:26ded7f450a0ad37241d2ae97ea521a59cb551a1785c8a950f74b0a291ad3aea AS production_stage

WORKDIR /app

COPY package*.json ./
COPY --from=build_stage /app/build ./build

# # install this to run the static frontend server
# RUN npm install sirv-cli

EXPOSE 4173

USER node
CMD ["node", "build/index.js"]
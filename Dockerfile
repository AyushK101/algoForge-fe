# s-1 builder
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpmfile.yaml ./
COPY .env ./ 
# for prisma

RUN npm install -g pnpm

RUN echo "network-timeout=600000" >> .npmrc

RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-timeout 60000 && \
    pnpm config set registry https://registry.npmjs.org

RUN pnpm i 

COPY . . 

RUN pnpm dlx prisma generate  --schema=./prisma/schema.prisma
## s-2
FROM node:20-slim 

WORKDIR /usr/src/app

RUN npm install pnpm -g 

COPY --from=builder /usr/src/app .
RUN rm .env

EXPOSE 3000

CMD ["pnpm","run","dev"]
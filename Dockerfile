# 1. BUILD STAGE
FROM node:16 as build-stage

WORKDIR /app

# Copy pkg files and install dependencies
COPY package*.json ./
COPY scripts/*.sh ./scripts/
RUN npm install

# Copy source files and build
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# 2. PRODUCTION STAGE
FROM gcr.io/distroless/nodejs:16

# Copy node_modules and build files
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist

# Copy static files
COPY src/public ./dist/public

# Expose and run
EXPOSE 8000
CMD ["dist/server.js"]


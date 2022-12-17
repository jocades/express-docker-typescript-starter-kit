# 1. BUILD STAGE
FROM node:16 AS build-stage

# Create user and set working directory with permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /usr/app && chown -R appuser:appgroup /usr/app
USER appuser
WORKDIR /usr/app

# Copy pkg files and install dependencies
COPY package*.json ./
COPY scripts/*.sh ./scripts/
RUN npm install --omit=dev

# Copy source files and build
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# 2. PRODUCTION STAGE
FROM node:16

# Copy node_modules and build files
COPY --from=build-stage /usr/app/node_modules ./node_modules
COPY --from=build-stage /usr/app/dist ./dist

# Copy static files
COPY src/public ./dist/public

# Expose and run
EXPOSE 8000
ENTRYPOINT ["npm", "start"]

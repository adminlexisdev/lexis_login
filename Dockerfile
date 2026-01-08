# Multi-stage Dockerfile for NestJS (with bcrypt, non-root runtime)

##########
# 1) deps: install all deps (dev + prod) for building
##########
FROM node:20-alpine AS deps
WORKDIR /app

# Tools needed for native modules like bcrypt on Alpine
# (build toolchain + python for node-gyp)
RUN apk add --no-cache python3 make g++

# Reproducible install (requires package-lock.json)
COPY package.json package-lock.json ./
RUN npm ci

##########
# 2) builder: build the application
##########
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

##########
# 3) prod-deps: install only production deps
##########
FROM node:20-alpine AS prod-deps
WORKDIR /app
ENV NODE_ENV=production

# Tools needed again because bcrypt may compile during npm ci
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Optional: clean npm cache (small improvement)
RUN npm cache clean --force

##########
# 4) runner: minimal runtime image (no root)
##########
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# init for correct signal handling (recommended in containers)
RUN apk add --no-cache dumb-init

# Create non-root user/group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what we need, with correct ownership
COPY --from=prod-deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder   --chown=appuser:appgroup /app/dist ./dist
COPY --chown=appuser:appgroup package.json ./package.json

USER appuser
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

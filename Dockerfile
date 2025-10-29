# Multi-stage Dockerfile for NestJS (best practices)

# 1) Install all dependencies (including dev) for building
FROM node:20-alpine AS deps
WORKDIR /app
# Ensure reproducible, cached installs
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 2) Build the application (requires dev deps)
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Install only production dependencies
FROM node:20-alpine AS prod-deps
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# 4) Create minimal runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules and built dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json

USER appuser
EXPOSE 3000

# Use the same entrypoint as start:prod
CMD ["node", "dist/main.js"]

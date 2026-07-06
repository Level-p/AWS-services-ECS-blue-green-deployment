# ----------------------------------
# Build stage
# ----------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# ----------------------------------
# Runtime stage
# ----------------------------------
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy build output and required files
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 3000

# Lightweight healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', res => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]
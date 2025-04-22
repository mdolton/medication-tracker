# Build stage
FROM node:18-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and package-lock.json from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.npmrc ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/database.sqlite ./

# Expose port
EXPOSE 3000

# Start the application using the compiled JavaScript
CMD ["node", "server.js"] 
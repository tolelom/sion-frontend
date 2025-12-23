# Multi-stage build for React + Vite frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Final stage - serve the built application
FROM node:18-alpine

# Install serve to run the production build
RUN npm install -g serve

WORKDIR /app

# Copy the built application from builder
COPY --from=builder /app/dist ./dist

# Copy package.json for reference
COPY package.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Set environment
ENV NODE_ENV=production

# Run the application
CMD ["serve", "-s", "dist", "-l", "3000"]

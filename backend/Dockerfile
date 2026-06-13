# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Install dependencies
RUN npm ci --workspace=backend

# Copy source code
COPY backend/src backend/src
COPY backend/tsconfig.json backend/

# Build backend
RUN npm run build --workspace=backend

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json backend/

# Install production dependencies only
RUN npm ci --workspace=backend --omit=dev

# Copy built application from builder
COPY --from=builder /app/backend/dist backend/dist

EXPOSE 5000

CMD ["npm", "start", "--workspace=backend"]

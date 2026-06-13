# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from root and workspaces
COPY package*.json ./
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/

# Install dependencies
RUN npm ci --workspace=frontend

# Copy source code
COPY frontend frontend

# Build frontend
RUN npm run build --workspace=frontend

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json frontend/

# Install production dependencies only
RUN npm ci --workspace=frontend --omit=dev

# Copy built application from builder
COPY --from=builder /app/frontend/.next frontend/.next
COPY --from=builder /app/frontend/public frontend/public

EXPOSE 3000

CMD ["npm", "start", "--workspace=frontend"]

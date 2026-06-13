# DevCloud Development Setup

This file documents the setup and development workflow for DevCloud.

## Project Structure

- **frontend/**: Next.js React application (Port 3000)
- **backend/**: Express.js Node.js API server (Port 5000)
- **docker-compose.yml**: PostgreSQL, Redis, MinIO services
- **package.json**: Monorepo root configuration

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Database Services
```bash
npm run docker:up
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

### 4. Run Database Migrations
```bash
npm run db:migrate
```

### 5. (Optional) Seed Sample Data
```bash
npm run db:seed
```

### 6. Start Development Servers
```bash
npm run dev
```

This starts both frontend and backend in development mode:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Available Commands

### Development
- `npm run dev` - Start both frontend and backend in dev mode
- `npm run build` - Build both frontend and backend
- `npm start` - Start production server (backend)

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed sample data

### Docker
- `npm run docker:up` - Start PostgreSQL, Redis, MinIO containers
- `npm run docker:down` - Stop all containers

### Workspace-specific Commands
- `npm run dev --workspace=frontend` - Start only frontend
- `npm run dev --workspace=backend` - Start only backend

## Services

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **User**: devcloud
- **Password**: devcloud123
- **Database**: devcloud

### Redis
- **URL**: redis://localhost:6379

### MinIO (S3-compatible storage)
- **Endpoint**: http://localhost:9000
- **Console**: http://localhost:9001
- **User**: minioadmin
- **Password**: minioadmin123

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.io for real-time updates

### Backend
- Express.js
- TypeScript
- PostgreSQL
- Redis
- JWT Authentication
- Socket.io

## Features

1. **Collaborative Code Editing**: Real-time code collaboration using WebSockets
2. **File Management**: Upload, organize, and share files
3. **Project Management**: Create and manage projects with team members
4. **VM Hosting**: Deploy and manage virtual machines
5. **User Authentication**: Secure JWT-based authentication

## Development Notes

- Both frontend and backend are TypeScript projects
- The monorepo uses npm workspaces for dependency management
- All configuration is environment-variable based
- CORS is configured to allow frontend requests
- Real-time features use Socket.io

## Next Steps

1. Implement authentication UI (login, signup pages)
2. Integrate MinIO for file storage
3. Add collaborative editor (Monaco or CodeMirror)
4. Implement VM provisioning logic
5. Add WebSocket real-time sync for file changes
6. Deploy using Docker Compose or Kubernetes

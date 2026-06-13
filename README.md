# DevCloud - GitHub + Drive + AI + VM Platform

A full-stack cloud platform combining code collaboration, file storage, AI integration, and virtual machine hosting.

## Features

- **Code Collaboration**: Real-time collaborative code editing (like GitHub)
- **File Storage**: Cloud file storage and sync (like Google Drive)
- **AI Integration**: AI-powered code assistance and automation
- **VM Hosting**: Host and manage virtual machines
- **User Authentication**: Secure user accounts and access control
- **Real-time Sync**: WebSocket-based real-time updates

## Tech Stack

- **Frontend**: Next.js 14+ (React, TypeScript)
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Cache**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Real-time**: WebSockets
- **Containerization**: Docker & Docker Compose

## Project Structure

```
devcloud/
├── frontend/           # Next.js application
├── backend/            # Express.js API server
├── docker-compose.yml  # Database & service configurations
├── .env.example        # Environment variables template
└── package.json        # Root workspace configuration
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd devcloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start database services**
   ```bash
   npm run docker:up
   ```

4. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

5. **Run migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5432

## Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend

# Production
npm run build            # Build both frontend and backend
npm start                # Start production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT

## Contributing

Contributions welcome! Please follow the contribution guidelines.

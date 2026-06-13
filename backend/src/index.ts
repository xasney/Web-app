import 'dotenv/config'
import 'express-async-errors'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import pino from 'pino'
import pinoHttp from 'pino-http'

// Routes
import authRoutes from './routes/auth'
import fileRoutes from './routes/files'
import projectRoutes from './routes/projects'
import vmRoutes from './routes/vms'

// Middleware
import { errorHandler } from './middleware/errorHandler'
import { authenticate } from './middleware/auth'

// Database
import { initializeDatabase } from './database/client'

const app: Express = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    credentials: true,
  },
})

const logger = pino()

// Middleware
app.use(pinoHttp({ logger }))
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/files', authenticate, fileRoutes)
app.use('/api/projects', authenticate, projectRoutes)
app.use('/api/vms', authenticate, vmRoutes)

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  logger.info('User connected:', socket.id)

  socket.on('join-project', (projectId: string) => {
    socket.join(`project:${projectId}`)
    socket.broadcast.to(`project:${projectId}`).emit('user-joined', {
      userId: socket.id,
      timestamp: new Date(),
    })
  })

  socket.on('code-change', (data: { projectId: string; content: string; language: string }) => {
    io.to(`project:${data.projectId}`).emit('code-updated', data)
  })

  socket.on('disconnect', () => {
    logger.info('User disconnected:', socket.id)
  })
})

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use(errorHandler)

// Initialize and start server
const PORT = Number(process.env.PORT || 5000)
const HOST = process.env.HOST || 'localhost'

async function start() {
  try {
    // Initialize database
    await initializeDatabase()
    logger.info('Database initialized')

    httpServer.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()

export { app, io }

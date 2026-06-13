import { Request, Response, NextFunction } from 'express'
import pino from 'pino'

const logger = pino()

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error('Error:', error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
    })
  }

  return res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
  })
}

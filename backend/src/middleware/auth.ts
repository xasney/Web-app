import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest, JWTPayload } from '../types'
import { AppError } from './errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const authenticate: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest

  try {
    const token = authReq.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('No token provided', 401)
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    authReq.user = decoded
    next()
    return
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Authentication error' })
  }
}

export function generateToken(payload: JWTPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY || '7d') as jwt.SignOptions['expiresIn'],
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

export function generateRefreshToken(payload: JWTPayload): string {
  const secret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
  const options: jwt.SignOptions = {
    expiresIn: '30d' as jwt.SignOptions['expiresIn'],
  }

  return jwt.sign(payload, secret, options)
}

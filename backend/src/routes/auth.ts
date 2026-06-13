import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../database/client'
import { generateToken, generateRefreshToken, authenticate } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest, User } from '../types'

const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, displayName } = req.body

    if (!email || !username || !password) {
      throw new AppError('Missing required fields', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query(
      `INSERT INTO users (email, username, password_hash, display_name)
       VALUES ($1, $2, $3, $4) RETURNING id, email, username, display_name, created_at`,
      [email, username, hashedPassword, displayName || username],
    )

    const user = result.rows[0] as User
    const token = generateToken({ userId: user.id, email: user.email })

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.display_name,
      },
      token,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password required', 400)
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0] as User

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash || '')

    if (!isValidPassword) {
      throw new AppError('Invalid password', 401)
    }

    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.display_name,
      },
      token,
      refreshToken,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  try {
    const result = await query('SELECT id, email, username, display_name, avatar_url FROM users WHERE id = $1', [
      authReq.user?.userId,
    ])

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404)
    }

    return res.json(result.rows[0])
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router

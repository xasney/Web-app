import { Pool, PoolClient } from 'pg'
import pino from 'pino'

const logger = pino()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://devcloud:devcloud123@localhost:5432/devcloud',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err)
})

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect()
}

export async function initializeDatabase() {
  try {
    const result = await query('SELECT NOW()')
    logger.info('Database connected successfully')
    return result
  } catch (error) {
    logger.error('Database connection failed:', error)
    throw error
  }
}

export { pool }

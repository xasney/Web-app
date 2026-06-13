import { query } from './client'
import bcrypt from 'bcryptjs'
import pino from 'pino'

const logger = pino()

export async function seedDatabase() {
  try {
    logger.info('Seeding database...')

    // Create sample user
    const hashedPassword = await bcrypt.hash('demo123', 10)
    
    await query(`
      INSERT INTO users (email, username, password_hash, display_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['demo@devcloud.app', 'demo', hashedPassword, 'Demo User'])

    logger.info('Database seeded successfully')
  } catch (error) {
    logger.error('Seeding error:', error)
    throw error
  }
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    logger.error('Fatal seeding error:', err)
    process.exit(1)
  })
}

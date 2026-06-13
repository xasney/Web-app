import { query } from './client'
import pino from 'pino'

const logger = pino()

export async function runMigrations() {
  try {
    logger.info('Running database migrations...')

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        avatar_url VARCHAR(500),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)

    // Create projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        visibility VARCHAR(50) DEFAULT 'private',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)

    // Create project members table
    await query(`
      CREATE TABLE IF NOT EXISTS project_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id),
        user_id UUID NOT NULL REFERENCES users(id),
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      )
    `)

    // Create files table
    await query(`
      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        size BIGINT,
        mime_type VARCHAR(100),
        storage_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)

    // Create vms table
    await query(`
      CREATE TABLE IF NOT EXISTS vms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        os VARCHAR(100),
        cpu INT DEFAULT 1,
        memory INT DEFAULT 512,
        storage INT DEFAULT 10,
        status VARCHAR(50) DEFAULT 'stopped',
        ip_address VARCHAR(50),
        port INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      )
    `)

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_vms_owner_id ON vms(owner_id)`)

    logger.info('Migrations completed successfully')
  } catch (error) {
    logger.error('Migration error:', error)
    throw error
  }
}

if (require.main === module) {
  runMigrations().catch((err) => {
    logger.error('Fatal migration error:', err)
    process.exit(1)
  })
}

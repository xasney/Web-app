import { Router, Request, Response } from 'express'
import { query } from '../database/client'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest, Project } from '../types'

const router = Router()

// List user projects
router.get('/', async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  try {
    const result = await query(
      `SELECT p.* FROM projects p
       WHERE p.owner_id = $1 OR p.id IN (
         SELECT project_id FROM project_members WHERE user_id = $1
       )
       AND p.deleted_at IS NULL`,
      [authReq.user?.userId],
    )

    return res.json(result.rows as Project[])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list projects' })
  }
})

// Create project
router.post('/', async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  try {
    const { name, description, visibility } = req.body

    const result = await query(
      `INSERT INTO projects (owner_id, name, description, visibility)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [authReq.user?.userId, name, description || null, visibility || 'private'],
    )

    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create project' })
  }
})

// Get project
router.get('/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const result = await query('SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL', [projectId])

    if (result.rows.length === 0) {
      throw new AppError('Project not found', 404)
    }

    return res.json(result.rows[0])
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Failed to get project' })
  }
})

// Update project
router.put('/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { name, description, visibility } = req.body

    const result = await query(
      `UPDATE projects SET name = $2, description = $3, visibility = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [projectId, name, description, visibility],
    )

    return res.json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete project
router.delete('/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    await query('UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [projectId])

    return res.json({ message: 'Project deleted' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project' })
  }
})

// Add project member
router.post('/:projectId/members', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { userId, role } = req.body

    const result = await query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [projectId, userId, role || 'member'],
    )

    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add member' })
  }
})

export default router

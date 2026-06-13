import { Router, Request, Response } from 'express'
import { query } from '../database/client'
import { File } from '../types'

const router = Router()

// List project files
router.get('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params

    const result = await query('SELECT * FROM files WHERE project_id = $1 AND deleted_at IS NULL', [projectId])

    return res.json(result.rows as File[])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list files' })
  }
})

// Upload file
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { projectId, name, type, size, mimeType, storagePath } = req.body

    const result = await query(
      `INSERT INTO files (project_id, name, type, size, mime_type, storage_path)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [projectId, name, type, size, mimeType, storagePath],
    )

    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Delete file
router.delete('/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params

    await query('UPDATE files SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [fileId])

    return res.json({ message: 'File deleted' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete file' })
  }
})

export default router

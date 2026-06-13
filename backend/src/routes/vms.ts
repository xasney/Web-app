import { Router, Request, Response } from 'express'
import { query } from '../database/client'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest, VM } from '../types'

const router = Router()

// List user VMs
router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest
    const result = await query('SELECT * FROM vms WHERE owner_id = $1 AND deleted_at IS NULL', [
      authReq.user?.userId,
    ])

    return res.json(result.rows as VM[])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list VMs' })
  }
})

// Create VM
router.post('/', async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  try {
    const { name, os, cpu, memory, storage } = req.body

    const result = await query(
      `INSERT INTO vms (owner_id, name, os, cpu, memory, storage, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [authReq.user?.userId, name, os || 'Ubuntu 22.04', cpu || 1, memory || 512, storage || 10, 'stopped'],
    )

    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create VM' })
  }
})

// Get VM
router.get('/:vmId', async (req: Request, res: Response) => {
  try {
    const { vmId } = req.params

    const result = await query('SELECT * FROM vms WHERE id = $1 AND deleted_at IS NULL', [vmId])

    if (result.rows.length === 0) {
      throw new AppError('VM not found', 404)
    }

    return res.json(result.rows[0])
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Failed to get VM' })
  }
})

// Start VM
router.post('/:vmId/start', async (req: Request, res: Response) => {
  try {
    const { vmId } = req.params

    // Here you would integrate with actual VM hosting (Docker, Proxmox, KVM, etc.)
    const result = await query(
      `UPDATE vms SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      ['running', vmId],
    )

    return res.json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to start VM' })
  }
})

// Stop VM
router.post('/:vmId/stop', async (req: Request, res: Response) => {
  try {
    const { vmId } = req.params

    const result = await query(
      `UPDATE vms SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      ['stopped', vmId],
    )

    return res.json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: 'Failed to stop VM' })
  }
})

// Delete VM
router.delete('/:vmId', async (req: Request, res: Response) => {
  try {
    const { vmId } = req.params

    await query('UPDATE vms SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [vmId])

    return res.json({ message: 'VM deleted' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete VM' })
  }
})

export default router

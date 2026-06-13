import { query } from '../database/client'
import { AppError } from './errorHandler'

export async function ensureProjectAccess(projectId: string, userId: string) {
  const result = await query(
    `SELECT p.* FROM projects p
     WHERE p.id = $1
       AND p.deleted_at IS NULL
       AND (
         p.owner_id = $2
         OR p.id IN (
           SELECT project_id FROM project_members WHERE user_id = $2
         )
       )`,
    [projectId, userId],
  )

  if (result.rows.length === 0) {
    throw new AppError('Project not found or access denied', 404)
  }

  return result.rows[0]
}

export async function ensureProjectOwner(projectId: string, userId: string) {
  const result = await query(
    `SELECT p.* FROM projects p
     WHERE p.id = $1
       AND p.deleted_at IS NULL
       AND p.owner_id = $2`,
    [projectId, userId],
  )

  if (result.rows.length === 0) {
    throw new AppError('Project not found or owner access required', 403)
  }

  return result.rows[0]
}

export async function ensureFileAccess(fileId: string, userId: string) {
  const result = await query(
    `SELECT f.* FROM files f
     JOIN projects p ON p.id = f.project_id
     WHERE f.id = $1
       AND f.deleted_at IS NULL
       AND p.deleted_at IS NULL
       AND (
         p.owner_id = $2
         OR p.id IN (
           SELECT project_id FROM project_members WHERE user_id = $2
         )
       )`,
    [fileId, userId],
  )

  if (result.rows.length === 0) {
    throw new AppError('File not found or access denied', 404)
  }

  return result.rows[0]
}

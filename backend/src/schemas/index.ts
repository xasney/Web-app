import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  displayName: z.string().max(255).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(2000).optional(),
  visibility: z.enum(['private', 'public', 'internal']).optional(),
})

export const projectMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']).optional(),
})

export const fileUploadSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1),
  type: z.string().max(100).optional(),
  size: z.number().int().nonnegative().optional(),
  mimeType: z.string().max(100).optional(),
  storagePath: z.string().min(1),
})

export const vmSchema = z.object({
  name: z.string().min(1),
  os: z.string().max(100).optional(),
  cpu: z.number().int().positive().optional(),
  memory: z.number().int().positive().optional(),
  storage: z.number().int().positive().optional(),
})

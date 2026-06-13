export interface User {
  id: string
  email: string
  username: string
  password_hash?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  owner_id: string
  name: string
  description?: string
  visibility: 'private' | 'public' | 'internal'
  created_at: Date
  updated_at: Date
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joined_at: Date
}

export interface File {
  id: string
  project_id: string
  name: string
  type?: string
  size: number
  mime_type?: string
  storage_path: string
  created_at: Date
  updated_at: Date
}

export interface VM {
  id: string
  owner_id: string
  name: string
  os: string
  cpu: number
  memory: number
  storage: number
  status: 'running' | 'stopped' | 'suspended'
  ip_address?: string
  port?: number
  created_at: Date
  updated_at: Date
}

import { Request } from 'express'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface AuthRequest extends Request {
  user?: JWTPayload
}

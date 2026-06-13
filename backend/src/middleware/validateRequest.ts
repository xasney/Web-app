import { AnyZodObject } from 'zod'
import { AppError } from './errorHandler'

export function validateBody<T extends AnyZodObject>(schema: T, payload: unknown) {
  const result = schema.safeParse(payload)

  if (!result.success) {
    const message = result.error.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join(', ')

    throw new AppError(message || 'Invalid request body', 400)
  }

  return result.data
}

import { KVSessionRepository } from '@/server/repository/session'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../env'

export const sessionRepositoryMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    const sessionRepository = new KVSessionRepository(c.env.SESSION_KV)
    c.set('sessionRepository', sessionRepository)
    await next()
  },
)

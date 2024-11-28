import * as schema from '@/server/db/schema'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../env'

export const drizzleMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('db', drizzle(c.env.DB, { schema }))
  await next()
})

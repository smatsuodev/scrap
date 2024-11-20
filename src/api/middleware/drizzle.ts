import type { AppEnv } from '@/api/env'
import * as schema from '@/db/schema'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'

export const drizzleMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('db', drizzle(c.env.DB, { schema }))
  await next()
})

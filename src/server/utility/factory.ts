import { SESSION_TTL } from '@/server/constant/session'
import * as schema from '@/server/db/schema'
import type { AppEnv } from '@/server/env'
import { KVSessionRepository } from '@/server/repository/session'
import { drizzle } from 'drizzle-orm/d1'
import { createFactory } from 'hono/factory'

/**
 * 依存を注入したインスタンスを生成する factory オブジェクト
 * refs: https://hono.dev/docs/helpers/factory#factory-createapp
 */
export const honoFactory = createFactory<AppEnv>({
  initApp: (app) => {
    app.use(async (c, next) => {
      // drizzle
      if (!c.var.db) {
        c.set('db', drizzle(c.env.DB, { schema }))
      }

      // session repository
      if (!c.var.sessionRepository) {
        const sessionRepo = new KVSessionRepository(
          c.env.SESSION_KV,
          SESSION_TTL,
        )
        c.set('sessionRepository', sessionRepo)
      }

      await next()
    })
    return app
  },
})

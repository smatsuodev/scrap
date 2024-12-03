import type { Session } from '@/common/model/session'
import type * as schema from '@/server/db/schema'
import type { ISessionRepository } from '@/server/repository/session'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export type AppEnv = {
  Bindings: {
    DB: D1Database
    SESSION_KV: KVNamespace
  }
  Variables: {
    db: DrizzleD1Database<typeof schema> & { $client: D1Database }
    sessionRepository: ISessionRepository
    session: Session | null
  }
}

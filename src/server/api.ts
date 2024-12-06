import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { sessionRepositoryMiddleware } from '@/server/middleware/sessionRepository'
import scrapFragments from '@/server/routes/scrapFragments'
import users from '@/server/routes/users'
import { Hono } from 'hono'
import type { AppEnv } from './env'
import { drizzleMiddleware } from './middleware/drizzle'
import auth from './routes/auth'
import fragments from './routes/fragments'
import scraps from './routes/scraps'

const api = new Hono<AppEnv>()
  .use(drizzleMiddleware)
  .use(sessionRepositoryMiddleware)

/**
 * scraps などは /scraps などの basePath が指定されているので、/ に連結する
 * 以下の理由で basePath を事前に設定している
 * - /foo/:scrapId のような不適切なルーティングを防ぐため
 *   (`.route('/foo', scraps)` のようにして作れてしまう)
 * - /scraps/:scrapId/fragments のようなネストしたリソースのコードの分割が自然になる
 *
 * 一方、`api` には以下の理由で /api の basePath を設定していない
 * - /api/v1/ のようなルートを作れなくなる
 *   (`.basePath('/v1')` のように設定するのは全然あり)
 * - `hc` で参照する際に `client.api.scraps` のように書くのが手間
 */
const protectedApi = new Hono<AppEnv>()
  .use(sessionAuthMiddleware)
  .route('/', scraps)
  .route('/', fragments)
  .route('/', scrapFragments)
  .route('/', users)

const routes = api.route('/', auth).route('/', protectedApi)

export type ApiType = typeof routes
export default api

import scrapFragments from '@/server/scrapFragments'
import { Hono } from 'hono'
import type { AppEnv } from './env'
import fragments from './fragments'
import { drizzleMiddleware } from './middleware/drizzle'
import scraps from './scraps'

const api = new Hono<AppEnv>()

api.use(drizzleMiddleware)

/**
 * scraps などは /scraps などの basePath が指定されているので、/ に連結する
 * 以下の理由で basePath を事前に設定している
 * - /foo/:scrapId のような不適切なルーティングを防ぐため
 *   (`.route('/foo', scraps)` のようにして作れてしまう)
 * - /scraps/:scrapId/fragments のようなネストしたリソースのコードの分割が自然になる
 *
 * 一方、`api` には以下の理由で /api の basePath を設定していない
 * - /api/v1/ のようなルートを作れなくなる。basePath がなければ `.route('/api/v1', api)` と書ける。
 *   (`.basePath('/v1')` のように設定するのは全然あり)
 * - `hc` で参照する際に `client.api.scraps` のように書くのが手間
 */
const routes = api
  .route('/', scraps)
  .route('/', fragments)
  .route('/', scrapFragments)

export type ApiType = typeof routes
export default api

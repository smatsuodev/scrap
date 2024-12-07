import scrapFragments from '@/server/routes/scrapFragments'
import users from '@/server/routes/users'
import { Hono } from 'hono'
import auth from './routes/auth'
import fragments from './routes/fragments'
import scraps from './routes/scraps'

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
 *
 * ===
 * utility の factory はあえて使っていない
 * なぜなら、子の app を factory で生成するので、依存オブジェクトの初期化をする middleware が複数回呼ばれてしまうから
 * (複数回呼んでも問題はないが、オーバーヘッドを避けたい)
 *
 * ===
 * 認証 middleware はここではなく、子の app で設定する
 * そうすると、実装時に拡張された Env が使える
 * refs: https://hono.dev/docs/guides/middleware#extending-the-context-in-middleware
 */
const api = new Hono()
  .route('/', auth)
  .route('/', scraps)
  .route('/', fragments)
  .route('/', scrapFragments)
  .route('/', users)

export type ApiType = typeof api
export default api

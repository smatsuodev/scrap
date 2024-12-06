import type { Session, SessionId } from '@/common/model/session'
import { deleteCookie, getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { SESSION_COOKIE_NAME } from '../constant/session'
import type { AppEnv } from '../env'

export const sessionAuthMiddleware = createMiddleware<
  AppEnv & {
    Variables: {
      session: Session
    }
  }
>(async (c, next) => {
  if (c.var.session) {
    // すでに認証済み
    return await next()
  }

  const sessionCookieValue = getCookie(c, SESSION_COOKIE_NAME)
  if (!sessionCookieValue) {
    throw new HTTPException(401)
  }

  const sessionId = sessionCookieValue as SessionId
  const session = await c.var.sessionRepository.loadSession(sessionId)
  if (!session) {
    // cookie を削除しないと 401 が返され続ける
    deleteCookie(c, SESSION_COOKIE_NAME)
    // 例外を投げると deleteCookie が反映されない
    return c.body(null, 401)
  }

  c.set('session', session)

  return await next()
})

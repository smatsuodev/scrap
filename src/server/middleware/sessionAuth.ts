import type { SessionId } from '@/common/model/session'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { SESSION_COOKIE_NAME } from '../constant/session'
import type { AppEnv } from '../env'

export const sessionAuthMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    const sessionCookieValue = getCookie(c, SESSION_COOKIE_NAME)
    if (!sessionCookieValue) {
      return c.body(null, 401)
    }

    const sessionId = sessionCookieValue as SessionId
    const session = await c.var.sessionRepository.loadSession(sessionId)
    if (!session) {
      return c.body(null, 401)
    }

    c.set('session', session)

    return await next()
  },
)

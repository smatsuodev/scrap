import type { User } from '@/common/model/user'
import type { AppEnv } from '@/server/env'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { Hono } from 'hono'

const users = new Hono<AppEnv>()
  .basePath('/users')
  .get('/me', sessionAuthMiddleware, async (c) => {
    const session = c.var.session
    if (!session) {
      return c.json(null, 401)
    }

    const user = await c.var.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.userId),
      columns: { id: true },
    })
    if (!user) {
      return c.json(null, 401)
    }

    return c.json({ id: user.id } satisfies User)
  })

export default users

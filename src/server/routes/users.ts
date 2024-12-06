import type { User } from '@/common/model/user'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { honoFactory } from '@/server/utility/factory'

const users = honoFactory
  .createApp()
  .basePath('/users')
  .use(sessionAuthMiddleware)
  .get('/me', sessionAuthMiddleware, async (c) => {
    const session = c.var.session

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

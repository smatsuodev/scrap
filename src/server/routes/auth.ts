import type { UserId } from '@/common/model/user'
import type { AppEnv } from '@/server/env'
import { zValidator } from '@hono/zod-validator'
import argon2 from 'argon2'
import { Hono } from 'hono'
import { z } from 'zod'

const auth = new Hono<AppEnv>().basePath('/auth').post(
  '/login',
  zValidator(
    'json',
    z.object({
      userId: z.string().transform((v) => v as UserId),
      password: z.string(),
    }),
  ),
  async (c) => {
    const { userId, password } = c.req.valid('json')
    const user = await c.var.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })
    if (!user) {
      return c.body(null, 401)
    }

    const isValid = await argon2.verify(user.password, password)
    if (!isValid) {
      return c.body(null, 401)
    }

    const session = await c.var.sessionRepository.createSession(userId)

    return c.json(session)
  },
)

export default auth

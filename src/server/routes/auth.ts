import { type SessionId, createSession } from '@/common/model/session'
import type { User, UserId } from '@/common/model/user'
import * as schema from '@/server/db/schema'
import type { AppEnv } from '@/server/env'
import { zValidator } from '@hono/zod-validator'
import argon2 from 'argon2'
import { Hono } from 'hono'
import { z } from 'zod'

const authInputValidator = zValidator(
  'json',
  z.object({
    userId: z.string().transform((v) => v as UserId),
    password: z.string(),
  }),
)

const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$0Q0Ws2400tORdPKxaOIN9g$q3UyPdURWOL4y6sG7jEtkfgxnGPDZ/9WWWNqdpq2Elk' as const

const auth = new Hono<AppEnv>()
  .basePath('/auth')
  .post('/login', authInputValidator, async (c) => {
    const { userId, password } = c.req.valid('json')
    const user = await c.var.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })

    /**
     * ユーザーが存在しない場合に即座にレスポンスを返すと、timing attack によってユーザーの存在を推測される可能性がある
     * そのため、ユーザーが存在しない場合でも、ダミーのパスワードハッシュを使って検証を行う
     */
    const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH
    const isValid = await argon2.verify(passwordHash, password)
    if (!user || !isValid) {
      return c.body(null, 401)
    }

    const session = createSession(userId)
    await c.var.sessionRepository.storeSession(session)

    return c.json(session)
  })
  .post('/register', authInputValidator, async (c) => {
    const { userId, password } = c.req.valid('json')

    // login と同様に timing attack によるユーザーの存在の推測を防ぐため、毎回ハッシュを計算する
    const passwordHash = await argon2.hash(password)

    const existingUser = await c.var.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })
    if (existingUser) {
      return c.body(null, 409) // Conflict
    }

    await c.var.db.insert(schema.users).values({
      id: userId,
      password: passwordHash,
    })

    return c.json({ id: userId } satisfies User, 201)
  })
  .post(
    '/logout',
    zValidator(
      'json',
      z.object({
        sessionId: z.string().transform((v) => v as SessionId),
      }),
    ),
    async (c) => {
      const { sessionId } = c.req.valid('json')

      const session = await c.var.sessionRepository.loadSession(sessionId)
      if (!session) {
        return c.body(null, 401)
      }

      await c.var.sessionRepository.removeSession(session)

      return c.body(null, 204)
    },
  )

export default auth

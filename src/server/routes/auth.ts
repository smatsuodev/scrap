import {
  type User,
  type UserId,
  userIdSchema,
  userPasswordSchema,
} from '@/common/model/user'
import { SESSION_COOKIE_NAME, SESSION_TTL } from '@/server/constant/session'
import * as schema from '@/server/db/schema'
import type { AppEnv } from '@/server/env'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { z } from 'zod'

const DUMMY_PASSWORD_HASH =
  '$2a$10$jl8KgQv7CRjy2K5rhoiLmOf6Xa4UTltGzdbn6vYDWGQlSuzXT4CpK'

const auth = new Hono<AppEnv>()
  .basePath('/auth')
  .post(
    '/login',
    zValidator(
      'json',
      z.object({
        userId: z
          .string()
          .min(1)
          .transform((v) => v as UserId),
        password: z.string().min(1),
      }),
    ),
    async (c) => {
      const { userId, password } = c.req.valid('json')
      const user = await c.var.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      })

      /**
       * ユーザーが存在しない場合に即座にレスポンスを返すと、timing attack によってユーザーの存在を推測される可能性がある
       * そのため、ユーザーが存在しない場合でも、ダミーのパスワードハッシュを使って検証を行う
       */
      const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH
      const isValid = bcrypt.compareSync(password, passwordHash)
      if (!user || !isValid) {
        return c.body(null, 401)
      }

      const session = await c.var.sessionRepository.createSession(userId)
      setCookie(c, SESSION_COOKIE_NAME, session.id, {
        httpOnly: true,
        sameSite: 'strict',
        // 開発環境で secure を有効化すると cookie が送られなくなるので、本番環境でのみ有効化する
        secure: import.meta.env.PROD,
        maxAge: SESSION_TTL,
      })

      return c.body(null, 204)
    },
  )
  .post(
    '/register',
    zValidator(
      'json',
      z.object({
        userId: userIdSchema.transform((v) => v as UserId),
        password: userPasswordSchema,
      }),
    ),
    async (c) => {
      const { userId, password } = c.req.valid('json')

      // login と同様に timing attack によるユーザーの存在の推測を防ぐため、毎回ハッシュを計算する
      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync())
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
    },
  )
  .post('/logout', sessionAuthMiddleware, async (c) => {
    const session = c.var.session
    if (!session) {
      // 認証 middleware を通しているので、実際は実行されないはず
      return c.body(null, 401)
    }

    await c.var.sessionRepository.removeSession(session)
    deleteCookie(c, SESSION_COOKIE_NAME)

    return c.body(null, 204)
  })

export default auth

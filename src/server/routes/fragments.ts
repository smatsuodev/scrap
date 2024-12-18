import type { FragmentId } from '@/common/model/fragment'
import * as schema from '@/server/db/schema'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { honoFactory } from '@/server/utility/factory'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { z } from 'zod'

const fragments = honoFactory
  .createApp()
  .basePath('/fragments')
  .use(sessionAuthMiddleware)
  .put(
    '/:fragmentId',
    zValidator(
      'json',
      // TODO: post と共通化したい
      z.object({
        content: z.string(),
      }),
    ),
    zValidator(
      'param',
      z.object({
        fragmentId: z.coerce.number().transform((v) => v as FragmentId),
      }),
    ),
    async (c) => {
      const { fragmentId } = c.req.valid('param')
      const { content } = c.req.valid('json')
      const db = drizzle(c.env.DB)
      await db
        .update(schema.fragments)
        .set({ content })
        .where(eq(schema.fragments.id, fragmentId))

      // TODO: 更新後の値を返す?
      return c.body(null, 204)
    },
  )

export default fragments

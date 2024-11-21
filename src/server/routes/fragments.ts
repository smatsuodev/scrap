import * as schema from '@/db/schema'
import type { FragmentId } from '@/model/fragment'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppEnv } from '../env'

const fragments = new Hono<AppEnv>().basePath('/fragments').put(
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

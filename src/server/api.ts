import * as schema from '@/db/schema'
import type { FragmentId } from '@/model/fragment'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppEnv } from './env'
import { drizzleMiddleware } from './middleware/drizzle'
import scraps from './scraps'

const api = new Hono<AppEnv>()

api.use(drizzleMiddleware)

const routes = api
  .route('/scraps', scraps)
  .get('/scraps/:id/fragments', async (c) => {
    const scrapId = c.req.param('id')
    const fragments = await c.var.db.query.fragments.findMany({
      where: (fragments, { eq }) => eq(fragments.scrapId, scrapId),
    })
    return c.json(fragments)
  })
  .post(
    '/scraps/:id/fragments',
    zValidator(
      'json',
      z.object({
        content: z.string(),
      }),
    ),
    async (c) => {
      const { content } = c.req.valid('json')
      const fragment = {
        scrapId: c.req.param('id'),
        content,
      }
      await c.var.db.insert(schema.fragments).values(fragment)
      return c.json(fragment, 201)
    },
  )
  .put(
    '/scraps/:scrapId/fragments/:fragmentId',
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
        scrapId: z.string(),
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

export type ApiType = typeof routes
export default api

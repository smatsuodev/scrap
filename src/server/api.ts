import * as schema from '@/db/schema'
import type { FragmentId } from '@/model/fragment'
import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { ulid } from 'ulidx'
import { z } from 'zod'
import type { AppEnv } from './env'
import { drizzleMiddleware } from './middleware/drizzle'

const api = new Hono<AppEnv>()

api.use(drizzleMiddleware)

const routes = api
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
  .get('/scraps/:id', async (c) => {
    const scrapId = c.req.param('id')
    const scrap = await c.var.db.query.scraps.findFirst({
      where: (scraps, { eq }) => eq(scraps.id, scrapId),
      with: {
        fragments: true,
      },
    })
    return c.json(scrap)
  })
  .get('/scraps', async (c) => {
    const scraps = await c.var.db.query.scraps.findMany({
      with: { fragments: true },
      limit: 30,
      orderBy: [desc(schema.scraps.updatedAt)],
    })
    return c.json(scraps)
  })
  .post(
    '/scraps',
    zValidator(
      'json',
      z.object({
        title: z.string(),
      }),
    ),
    async (c) => {
      const { title } = c.req.valid('json')
      const scrap = {
        id: ulid(),
        title,
      }
      await c.var.db.insert(schema.scraps).values(scrap)
      return c.json(scrap, 201)
    },
  )
  .put(
    '/scraps/:id',
    zValidator('json', z.object({ title: z.string() })),
    async (c) => {
      const { title } = c.req.valid('json')
      const scrap = {
        id: c.req.param('id'),
        title,
      }
      await c.var.db
        .update(schema.scraps)
        .set(scrap)
        .where(eq(schema.scraps.id, scrap.id))

      return c.json(scrap)
    },
  )

export type ApiType = typeof routes
export default api

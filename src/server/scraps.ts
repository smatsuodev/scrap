import * as schema from '@/db/schema'
import type { AppEnv } from '@/server/env'
import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { ulid } from 'ulidx'
import { z } from 'zod'

const scraps = new Hono<AppEnv>()
  .get('/', async (c) => {
    const scraps = await c.var.db.query.scraps.findMany({
      with: { fragments: true },
      limit: 30,
      orderBy: [desc(schema.scraps.updatedAt)],
    })
    return c.json(scraps)
  })
  .post(
    '/',
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
  .get('/:id', async (c) => {
    const scrapId = c.req.param('id')
    const scrap = await c.var.db.query.scraps.findFirst({
      where: (scraps, { eq }) => eq(scraps.id, scrapId),
      with: {
        fragments: true,
      },
    })
    return c.json(scrap)
  })
  .put(
    '/:id',
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

export default scraps

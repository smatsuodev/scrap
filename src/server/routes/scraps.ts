import type { Scrap } from '@/common/model/scrap'
import * as schema from '@/server/db/schema'
import { sessionAuthMiddleware } from '@/server/middleware/sessionAuth'
import { honoFactory } from '@/server/utility/factory'
import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { ulid } from 'ulidx'
import { z } from 'zod'

const scraps = honoFactory
  .createApp()
  .basePath('/scraps')
  .use(sessionAuthMiddleware)
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
      const session = c.var.session

      /**
       * 1行の挿入でも array で返ってきてしまう
       * refs: https://github.com/drizzle-team/drizzle-orm/issues/1237
       */
      const [row] = await c.var.db
        .insert(schema.scraps)
        .values({
          id: ulid(),
          title,
          ownerId: session.userId,
        })
        .returning()
      if (!row) {
        throw new HTTPException(500)
      }

      const scrap: Scrap = {
        ...row,
        fragments: [],
      }
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
    if (!scrap) {
      throw new HTTPException(404)
    }

    const scrapModel: Scrap = {
      ...scrap,
    }
    return c.json(scrapModel)
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

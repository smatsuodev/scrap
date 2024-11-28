import * as schema from '@/db/schema'
import type { AppEnv } from '@/server/env'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const scrapIdParamValidator = zValidator(
  'param',
  z.object({
    scrapId: z.string(),
  }),
)

const scrapFragments = new Hono<AppEnv>()
  .basePath('/scraps/:scrapId/fragments')
  .get('/', scrapIdParamValidator, async (c) => {
    const { scrapId } = c.req.valid('param')
    const fragments = await c.var.db.query.fragments.findMany({
      where: (fragments, { eq }) => eq(fragments.scrapId, scrapId),
    })
    return c.json(fragments)
  })
  .post(
    '/',
    scrapIdParamValidator,
    zValidator(
      'json',
      z.object({
        content: z.string(),
      }),
    ),
    async (c) => {
      const { scrapId } = c.req.valid('param')
      const { content } = c.req.valid('json')
      const fragment = {
        scrapId,
        content,
      }
      await c.var.db.insert(schema.fragments).values(fragment)
      return c.json(fragment, 201)
    },
  )

export default scrapFragments

import * as schema from '@/db/schema'
import { zValidator } from '@hono/zod-validator'
import { ColorSchemeScript } from '@mantine/core'
import { eq } from 'drizzle-orm'
import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { renderToString } from 'react-dom/server'
import { detectPrng, factory } from 'ulid'
import { z } from 'zod'

const drizzleMiddleware = createMiddleware(async (c, next) => {
  c.set('db', drizzle(c.env.DB, { schema }))
  await next()
})

type Env = {
  Bindings: { DB: D1Database }
  Variables: {
    db: DrizzleD1Database<typeof schema> & { $client: D1Database }
  }
}

const api = new Hono<Env>()
  .get('/scraps/:id/fragments', drizzleMiddleware, async (c) => {
    const scrapId = c.req.param('id')
    const fragments = await c.var.db.query.fragments.findMany({
      where: (fragments, { eq }) => eq(fragments.scrapId, scrapId),
    })
    return c.json(fragments)
  })
  .post(
    '/scraps/:id/fragments',
    drizzleMiddleware,
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
      await c.var.db.insert(schema.fragments).values(fragment).execute()
      return c.json(fragment, 201)
    },
  )
  .get('/scraps/:id', drizzleMiddleware, async (c) => {
    const scrapId = c.req.param('id')
    const scrap = await c.var.db.query.scraps.findFirst({
      where: (scraps, { eq }) => eq(scraps.id, scrapId),
      with: {
        fragments: true,
      },
    })
    return c.json(scrap)
  })
  .post(
    '/scraps',
    drizzleMiddleware,
    zValidator(
      'json',
      z.object({
        title: z.string(),
      }),
    ),
    async (c) => {
      const { title } = c.req.valid('json')
      // FIXME: ulidライブラリはdynamic requireでPRNGを読み込むが、Cloudflare Pagesでは動作しないため、Math.randomを使うことを許している
      // Math.randomは安全ではないので対処法をいつか考える
      const prng = detectPrng(true)
      const ulid = factory(prng)
      const scrap = {
        id: ulid(Date.now()),
        title,
      }
      await c.var.db.insert(schema.scraps).values(scrap).execute()
      return c.json(scrap, 201)
    },
  )
  .put(
    '/scraps/:id',
    drizzleMiddleware,
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
        .execute()
      return c.json(scrap)
    },
  )

const app = new Hono().route('/api', api).get('*', (c) => {
  return c.html(
    renderToString(
      <html lang='ja'>
        <head>
          <meta charSet='utf-8' />
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          <link rel='stylesheet' href='/static/assets/index.css' />
          {import.meta.env.PROD ? (
            <script type='module' src='/static/client.js' />
          ) : (
            <script type='module' src='/src/client/index.tsx' />
          )}
          <ColorSchemeScript />
        </head>
        <body>
          <div id='root' />
        </body>
      </html>,
    ),
  )
})

export default app
export type ApiType = typeof api

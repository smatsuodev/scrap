import * as schema from '@/db/schema'
import { zValidator } from '@hono/zod-validator'
import { ColorSchemeScript } from '@mantine/core'
import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { renderToString } from 'react-dom/server'
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
  .get('/fragments', drizzleMiddleware, async (c) => {
    const fragments = await c.var.db.query.fragments.findMany()
    return c.json(fragments)
  })
  .post(
    '/fragments',
    drizzleMiddleware,
    zValidator(
      'json',
      z.object({
        content: z.string(),
      }),
    ),
    async (c) => {
      const { content } = c.req.valid('json')
      await c.var.db.insert(schema.fragments).values({ content }).execute()
      return c.body(null, 201)
    },
  )

const app = new Hono().get('/', (c) => {
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

app.route('/api', api)

export default app
export type ApiType = typeof api

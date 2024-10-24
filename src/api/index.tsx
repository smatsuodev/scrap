import { ColorSchemeScript } from '@mantine/core'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { fragmentsTable } from '@/db/schema'

interface D1Bindings {
  DB: D1Database
}

const api = new Hono<{ Bindings: D1Bindings }>()
  .get('/fragments', async (c) => {
    const db = drizzle(c.env.DB)
    const fragments = await db.select().from(fragmentsTable)
    return c.json(fragments)
  })
  .post(
    '/fragments',
    zValidator(
      'json',
      z.object({
        content: z.string(),
      }),
    ),
    async (c) => {
      const { content } = c.req.valid('json')
      const db = drizzle(c.env.DB)
      await db.insert(fragmentsTable).values({ content }).execute()
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

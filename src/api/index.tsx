import type { FragmentInput, Fragment } from '@/client/model/fragment'
import { ColorSchemeScript } from '@mantine/core'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

interface D1Bindings {
  DB: D1Database
}

const dataStore = [{ id: 1, content: 'hello' }]

const api = new Hono<{ Bindings: D1Bindings }>()
  .get('/fragments', (c) => {
    return c.json(dataStore)
  })
  .post(
    '/fragments',
    zValidator(
      'json',
      z.object({
        content: z.string(),
      }),
    ),
    (c) => {
      const { content } = c.req.valid('json')
      dataStore.push({ id: dataStore.length + 1, content })
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

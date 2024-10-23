import type { FragmentInput, Fragment } from '@/client/model/fragment'
import { ColorSchemeScript } from '@mantine/core'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

interface D1Bindings {
  DB: D1Database
}

const api = new Hono<{ Bindings: D1Bindings }>()
api
  .get('/fragments', async (c) => {
    return c.json(
      await c.env.DB.prepare('SELECT * FROM fragments').all<Fragment>(),
    )
  })
  .post(async (c) => {
    const { content } = await c.req.parseBody<FragmentInput>()

    c.env.DB.prepare('INSERT INTO fragments (contetn) VALUES (?)')
      .bind(content)
      .run()

    return c.status(201)
  })

const app = new Hono()

app.get('/', (c) => {
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

api.get('/hello', (c) => c.text('hello'))

app.route('/api', api)

export default app

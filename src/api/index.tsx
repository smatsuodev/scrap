import { ColorSchemeScript } from '@mantine/core'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

app.get('/api/clock', (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  })
})

app.get('/', (c) => {
  return c.html(
    renderToString(
      <html lang='ja'>
        <head>
          <meta charSet='utf-8' />
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          <link type='stylesheet' href='/static/style.css' />
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

import { ColorSchemeScript } from '@mantine/core'
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import api from './api'

const app = new Hono().route('/api', api).get('*', (c) => {
  return c.html(
    renderToString(
      <html lang='ja'>
        <head>
          <meta charSet='utf-8' />
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          {import.meta.env.PROD ? (
            <>
              <link rel='stylesheet' href='/static/assets/index.css' />
              <script type='module' src='/static/client.js' />
            </>
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

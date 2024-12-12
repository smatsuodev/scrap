import passkeyAuth from '@/server/routes/auth/passkey'
import passwordAuth from '@/server/routes/auth/password'
import { Hono } from 'hono'

const auth = new Hono()
  .basePath('/auth')
  .route('/', passwordAuth)
  .route('/passkey', passkeyAuth)

export default auth

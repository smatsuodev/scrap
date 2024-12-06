import type { AppEnv } from '@/server/env'
import passwordAuth from '@/server/routes/auth/password'
import { Hono } from 'hono'

const auth = new Hono<AppEnv>().basePath('/auth').route('/', passwordAuth)

export default auth

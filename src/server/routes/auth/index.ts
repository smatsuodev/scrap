import passwordAuth from '@/server/routes/auth/password'
import { Hono } from 'hono'

const auth = new Hono().basePath('/auth').route('/', passwordAuth)

export default auth

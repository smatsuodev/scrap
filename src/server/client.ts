// refs: https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended

import { hc } from 'hono/client'
import type { ApiType } from './api'

// this is a trick to calculate the type when compiling
const client = hc<ApiType>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<ApiType>(...args)

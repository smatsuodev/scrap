import { hcWithType } from '@/server/client'

export async function isAuthenticated() {
  const client = hcWithType('/api')
  const res = await client.users.me.$get()
  return res.ok
}

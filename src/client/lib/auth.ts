import type { User } from '@/common/model/user'
import { hcWithType } from '@/server/client'

export async function isAuthenticated() {
  const client = hcWithType('/api')
  const res = await client.users.me.$get()
  return res.ok
}

export async function currentUser(): Promise<User | null> {
  const client = hcWithType('/api')
  const res = await client.users.me.$get()
  if (!res.ok) {
    return null
  }
  return await res.json()
}

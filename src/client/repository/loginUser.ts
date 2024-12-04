import type { User } from '@/common/model/user'
import { hcWithType } from '@/server/client'

export interface ILoginUserRepository {
  getUser(): Promise<User | null>
}

export class LoginUserRepository implements ILoginUserRepository {
  async getUser(): Promise<User | null> {
    const client = hcWithType('/api')
    const res = await client.users.me.$get()
    if (!res.ok) {
      return null
    }
    return await res.json()
  }
}

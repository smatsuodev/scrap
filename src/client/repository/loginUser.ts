import type { User } from '@/common/model/user'
import type { Client } from '@/server/client'

export interface ILoginUserRepository {
  getUser(): Promise<User | null>
}

export class LoginUserRepository implements ILoginUserRepository {
  constructor(private client: Client) {}

  async getUser(): Promise<User | null> {
    const res = await this.client.users.me.$get()
    if (!res.ok) {
      return null
    }
    return await res.json()
  }
}

import type { User, UserId } from '@/common/model/user'
import type * as schema from '@/server/db/schema'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export interface IUserRepository {
  find(userId: UserId): Promise<User | null>
}

export class UserRepository implements IUserRepository {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async find(userId: UserId) {
    const rows = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })
    if (!rows) {
      return null
    }

    return {
      ...rows,
    }
  }
}

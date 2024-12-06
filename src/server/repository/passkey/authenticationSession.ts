import type { UserId } from '@/common/model/user'
import { z } from 'zod'

const authenticationSessionSchema = z.object({
  challenge: z.string(),
})
export type AuthenticationSession = z.infer<typeof authenticationSessionSchema>

export interface IPasskeyAuthenticationSessionRepository {
  store(userId: UserId, session: AuthenticationSession): Promise<void>
  load(userId: UserId): Promise<AuthenticationSession | null>
}

export class KVPasskeyAuthenticationSessionRepository
  implements IPasskeyAuthenticationSessionRepository
{
  constructor(
    private kv: KVNamespace,
    private ttl?: number,
  ) {}

  async store(userId: UserId, session: AuthenticationSession): Promise<void> {
    const key = this.formatKey(userId)
    const options = this.ttl ? { expirationTtl: this.ttl } : {}
    await this.kv.put(key, JSON.stringify(session), options)
  }

  async load(userId: UserId): Promise<AuthenticationSession | null> {
    const key = this.formatKey(userId)
    const raw = await this.kv.get(key)
    if (raw === null) {
      return null
    }

    try {
      return authenticationSessionSchema.parse(JSON.parse(raw))
    } catch (e) {
      return null
    }
  }

  private formatKey(userId: UserId) {
    return `passkey:authentication:${userId}`
  }
}

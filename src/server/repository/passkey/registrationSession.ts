import type { UserId } from '@/common/model/user'
import { z } from 'zod'

const passkeyRegistrationSessionSchema = z.object({
  challenge: z.string(),
  webauthnUserId: z.string(),
})
export type RegistrationSession = z.infer<
  typeof passkeyRegistrationSessionSchema
>

export interface IPasskeyRegistrationSessionRepository {
  store(userId: UserId, session: RegistrationSession): Promise<void>
  load(userId: UserId): Promise<RegistrationSession | null>
}

export class KVPasskeyRegistrationSessionRepository
  implements IPasskeyRegistrationSessionRepository
{
  constructor(
    private kv: KVNamespace,
    private ttl?: number,
  ) {}

  async store(userId: UserId, session: RegistrationSession) {
    const key = this.formatKey(userId)
    const options = this.ttl ? { expirationTtl: this.ttl } : {}
    await this.kv.put(key, JSON.stringify(session), options)
  }

  async load(userId: UserId) {
    const key = this.formatKey(userId)
    const raw = await this.kv.get(key)
    if (!raw) {
      return null
    }

    try {
      return passkeyRegistrationSessionSchema.parse(JSON.parse(raw))
    } catch (e) {
      console.error(e)
      return null
    }
  }

  private formatKey(userId: UserId) {
    return `passkey:registration:${userId}`
  }
}

import {
  type Session,
  type SessionId,
  SessionSchema,
} from '@/common/model/session'
import type { UserId } from '@/common/model/user'
import { ulid } from 'ulidx'

export interface ISessionRepository {
  createSession(userId: UserId): Promise<Session>
  loadSession(sessionId: SessionId): Promise<Session | null>
  removeSession(session: Session): Promise<void>
}

export class KVSessionRepository implements ISessionRepository {
  constructor(
    private kv: KVNamespace,
    private ttl?: number,
  ) {}

  async createSession(userId: UserId): Promise<Session> {
    const sessionId = this.generateSessionId()
    const session: Session = {
      id: sessionId,
      userId,
    }
    await this.storeSession(session)

    return session
  }

  private async storeSession(session: Session): Promise<void> {
    const key = this.formatKey(session.id)
    const options = this.ttl ? { expirationTtl: this.ttl } : {}
    await this.kv.put(key, JSON.stringify(session), options)
  }

  async loadSession(sessionId: SessionId): Promise<Session | null> {
    const key = this.formatKey(sessionId)
    const rawSessionString = await this.kv.get(key)
    if (!rawSessionString) {
      return null
    }

    try {
      return SessionSchema.parse(JSON.parse(rawSessionString))
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async removeSession(session: Session): Promise<void> {
    const key = this.formatKey(session.id)
    await this.kv.delete(key)
  }

  private formatKey(sessionId: SessionId): string {
    return `session:${sessionId}`
  }

  private generateSessionId(): SessionId {
    return ulid() as SessionId
  }
}

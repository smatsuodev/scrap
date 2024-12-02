import {
  type Session,
  type SessionId,
  SessionSchema,
} from '@/common/model/session'
import type { UserId } from '@/common/model/user'
import { ulid } from 'ulidx'

export interface ISessionRepository {
  createSession(userId: UserId): Promise<Session>
  storeSession(session: Session): Promise<void>
  loadSession(sessionId: SessionId): Promise<Session | null>
}

export class KVSessionRepository implements ISessionRepository {
  constructor(private kv: KVNamespace) {}

  async createSession(userId: UserId): Promise<Session> {
    const sessionId = this.generateSessionId()
    const session: Session = {
      id: sessionId,
      userId,
    }
    await this.storeSession(session)

    return session
  }

  async storeSession(session: Session): Promise<void> {
    const key = this.formatKey(session.id)
    await this.kv.put(key, JSON.stringify(session))
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

  private generateSessionId(): SessionId {
    return ulid() as SessionId
  }

  private formatKey(sessionId: SessionId): string {
    return `session:${sessionId}`
  }
}

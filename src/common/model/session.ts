import type { Brand } from '@/common/brand'
import type { UserId } from '@/common/model/user'
import { ulid } from 'ulidx'
import { z } from 'zod'

export type SessionId = Brand<string, 'SessionId'>

export const SessionSchema = z.object({
  id: z.string().transform((v) => v as SessionId),
  userId: z.string().transform((v) => v as UserId),
})
export type Session = z.infer<typeof SessionSchema>

export function createSession(userId: UserId): Session {
  return {
    id: generateSessionId(),
    userId,
  }
}

function generateSessionId(): SessionId {
  return ulid() as SessionId
}

import type { UserId } from '@/common/model/user'
import * as schema from '@/server/db/schema'
import type { Passkey } from '@/server/model/passkey'
import { eq, sql } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export interface IPasskeyRepository {
  findByUserId(userId: UserId): Promise<Passkey[]>
  find(credentialId: Passkey['id']): Promise<Passkey | null>
  save(passkey: Passkey): Promise<void>
  updateLastUsedAt(credentialId: Passkey['id']): Promise<void>
}

export class PasskeyRepository implements IPasskeyRepository {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async findByUserId(userId: UserId) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: { passkeys: true },
    })
    if (!user) return []

    const passkeys: Passkey[] = user.passkeys.map((p) => ({
      ...p,
      user,
    }))
    return passkeys
  }

  async find(credentialId: Passkey['id']) {
    const passkey = await this.db.query.passkeys.findFirst({
      where: (passkeys, { eq }) => eq(passkeys.id, credentialId),
      with: { user: true },
    })
    if (!passkey) return null

    return {
      ...passkey,
    }
  }

  async save(passkey: Passkey) {
    // upsert
    await this.db
      .insert(schema.passkeys)
      .values({
        id: passkey.id,
        publicKey: passkey.publicKey,
        userId: passkey.user.id,
        webauthnUserId: passkey.webauthnUserId,
        counter: passkey.counter,
        isBackedUp: passkey.isBackedUp,
        deviceType: passkey.deviceType,
        transports: passkey.transports,
      })
      .onConflictDoUpdate({
        target: schema.passkeys.id,
        set: {
          counter: passkey.counter,
          isBackedUp: passkey.isBackedUp,
          deviceType: passkey.deviceType,
          transports: passkey.transports,
        },
      })
  }

  async updateLastUsedAt(credentialId: Passkey['id']): Promise<void> {
    await this.db
      .update(schema.passkeys)
      .set({
        lastUsedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(schema.passkeys.id, credentialId))
  }
}

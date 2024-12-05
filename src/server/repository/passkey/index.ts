import type { UserId } from '@/common/model/user'
import * as schema from '@/server/db/schema'
import type { Passkey } from '@/server/model/passkey'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export interface IPasskeyRepository {
  findByUserId(userId: UserId): Promise<Passkey[]>
  findByWebauthnUserIdAndUserId(
    webauthnUserId: Passkey['webauthnUserId'],
    userId: UserId,
  ): Promise<Passkey | null>
  save(passkey: Passkey): Promise<void>
}

export class PasskeyRepository implements IPasskeyRepository {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async findByUserId(userId: UserId) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: { passkeys: true },
    })

    return (
      user?.passkeys.map((p) => ({
        ...p,
        user: {
          id: user.id,
        },
      })) ?? []
    )
  }

  async findByWebauthnUserIdAndUserId(
    webauthnUserId: Passkey['webauthnUserId'],
    userId: UserId,
  ) {
    const passkey = await this.db.query.passkeys.findFirst({
      where: (passkeys, { and, eq }) =>
        and(
          eq(passkeys.webauthnUserId, webauthnUserId),
          eq(passkeys.userId, userId),
        ),
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
          publicKey: passkey.publicKey,
          userId: passkey.user.id,
          webauthnUserId: passkey.webauthnUserId,
          counter: passkey.counter,
          isBackedUp: passkey.isBackedUp,
          deviceType: passkey.deviceType,
          transports: passkey.transports,
        },
      })
  }
}

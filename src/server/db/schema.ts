import type { FragmentId } from '@/common/model/fragment'
import type { UserId } from '@/common/model/user'
import { uint8ArrayAsBase64 } from '@/server/db/customType'
import type {
  AuthenticatorTransportFuture,
  Base64URLString,
  CredentialDeviceType,
} from '@simplewebauthn/types'
import { relations, sql } from 'drizzle-orm'
import { index, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const fragments = sqliteTable('fragments', {
  id: int().$type<FragmentId>().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  scrapId: text('scrap_id')
    .notNull()
    .references(() => scraps.id),
  authorId: text('author_id')
    .$type<UserId>()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})
export const fragmentsRelations = relations(fragments, ({ one }) => ({
  scrap: one(scraps, {
    fields: [fragments.scrapId],
    references: [scraps.id],
  }),
  author: one(users, {
    fields: [fragments.authorId],
    references: [users.id],
  }),
}))

export const scraps = sqliteTable('scraps', {
  id: text().primaryKey(),
  title: text().notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  ownerId: text('owner_id')
    .$type<UserId>()
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
})
export const scrapsRelations = relations(scraps, ({ one, many }) => ({
  fragments: many(fragments),
  owner: one(users, {
    fields: [scraps.ownerId],
    references: [users.id],
  }),
}))

export const users = sqliteTable('users', {
  id: text().$type<UserId>().primaryKey(),
  password: text().notNull(),
})
export const usersRelations = relations(users, ({ many }) => ({
  scraps: many(scraps),
  passkeys: many(passkeys),
}))

// refs: https://simplewebauthn.dev/docs/packages/server#additional-data-structures
export const passkeys = sqliteTable(
  'passkeys',
  {
    id: text().$type<Base64URLString>().primaryKey(),
    publicKey: uint8ArrayAsBase64('public_key').notNull(),
    userId: text('user_id')
      .$type<UserId>()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    webauthnUserId: text('webauthn_user_id')
      .$type<Base64URLString>()
      .notNull()
      .unique(),
    counter: int().notNull(),
    isBackedUp: int('is_backed_up', { mode: 'boolean' }).notNull(),
    deviceType: text('device_type', {
      enum: ['singleDevice', 'multiDevice'],
    })
      .$type<CredentialDeviceType>()
      .notNull(),
    transports: text('transports', { mode: 'json' }).$type<
      AuthenticatorTransportFuture[]
    >(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    // 最終ログイン日時
    lastUsedAt: text('last_used_at'),
  },
  (table) => ({
    userIdWebauthnUserIdUk: unique('user_id_webauthn_user_id_uk').on(
      table.userId,
      table.webauthnUserId,
    ),
    userIdIdIdx: index('user_id_id_idx').on(table.userId, table.id),
    webauthnUserIdIdIdx: index('webauthn_user_id_id_idx').on(
      table.webauthnUserId,
      table.id,
    ),
  }),
)
export const passkeysRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}))

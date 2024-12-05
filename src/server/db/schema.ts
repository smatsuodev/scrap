import type { FragmentId } from '@/common/model/fragment'
import type { UserId } from '@/common/model/user'
import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
}))

import type { FragmentId } from '@/common/model/fragment'
import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const fragments = sqliteTable('fragments', {
  id: int().$type<FragmentId>().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  scrapId: text('scrap_id')
    .notNull()
    .references(() => scraps.id),
})

export const fragmentsRelations = relations(fragments, ({ one }) => ({
  scrap: one(scraps, {
    fields: [fragments.scrapId],
    references: [scraps.id],
  }),
}))

export const scraps = sqliteTable('scraps', {
  id: text().primaryKey(),
  title: text().notNull(),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
})

export const scrapsRelations = relations(scraps, ({ many }) => ({
  fragments: many(fragments),
}))

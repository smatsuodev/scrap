import { relations } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const fragments = sqliteTable('fragments', {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  scrapId: int('scrap_id').references(() => scraps.id),
})

export const fragmentsRelations = relations(fragments, ({ one }) => ({
  scrap: one(scraps, {
    fields: [fragments.scrapId],
    references: [scraps.id],
  }),
}))

export const scraps = sqliteTable('scraps', {
  id: text().notNull(),
  title: text().notNull(),
})

export const scrapsRelations = relations(scraps, ({ many }) => ({
  fragments: many(fragments),
}))

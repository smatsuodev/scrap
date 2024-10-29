import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const fragments = sqliteTable('fragments', {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
})

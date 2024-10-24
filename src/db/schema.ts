import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const fragmentsTable = sqliteTable('fragments', {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
})

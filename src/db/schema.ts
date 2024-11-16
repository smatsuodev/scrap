import type { FragmentId } from '@/model/fragment'
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

/*
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_scraps` (
    `id` text PRIMARY KEY NOT NULL,
    `title` text NOT NULL,
    `updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_scraps`("id", "title") SELECT "id", "title" FROM `scraps`;--> statement-breakpoint
DROP TABLE `scraps`;--> statement-breakpoint
ALTER TABLE `__new_scraps` RENAME TO `scraps`;
*/

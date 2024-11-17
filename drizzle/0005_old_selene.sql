PRAGMA foreign_keys=ON;
CREATE TABLE `__new_scraps` (
    `id` text PRIMARY KEY NOT NULL,
    `title` text NOT NULL,
    `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
INSERT INTO `__new_scraps`("id", "title") SELECT "id", "title" FROM `scraps`;
CREATE TABLE `__new_fragments` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `content` text NOT NULL,
    `scrap_id` text NOT NULL,
    FOREIGN KEY (`scrap_id`) REFERENCES `__new_scraps`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO `__new_fragments`("id", "content", "scrap_id") SELECT "id", "content", "scrap_id" FROM `fragments`;
DROP TABLE `fragments`;
DROP TABLE `scraps`;
ALTER TABLE `__new_fragments` RENAME TO `fragments`;
ALTER TABLE `__new_scraps` RENAME TO `scraps`;

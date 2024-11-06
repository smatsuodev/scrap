PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_fragments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`scrap_id` text NOT NULL,
	FOREIGN KEY (`scrap_id`) REFERENCES `scraps`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `fragments`;--> statement-breakpoint
ALTER TABLE `__new_fragments` RENAME TO `fragments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_scraps` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_scraps`("id", "title") SELECT "id", "title" FROM `scraps`;--> statement-breakpoint
DROP TABLE `scraps`;--> statement-breakpoint
ALTER TABLE `__new_scraps` RENAME TO `scraps`;
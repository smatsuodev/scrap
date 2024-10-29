CREATE TABLE `scraps` (
	`id` text NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `fragments` ADD `scrap_id` integer REFERENCES scraps(id);
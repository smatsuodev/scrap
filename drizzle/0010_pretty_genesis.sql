PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_passkeys` (
	`id` text PRIMARY KEY NOT NULL,
	`public_key` blob NOT NULL,
	`user_id` text NOT NULL,
	`webauthn_user_id` text NOT NULL,
	`counter` integer NOT NULL,
	`is_backed_up` integer NOT NULL,
	`device_type` text NOT NULL,
	`transports` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`last_used_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_passkeys`("id", "public_key", "user_id", "webauthn_user_id", "counter", "is_backed_up", "device_type", "transports", "created_at", "last_used_at") SELECT "id", "public_key", "user_id", "webauthn_user_id", "counter", "is_backed_up", "device_type", "transports", "created_at", "last_used_at" FROM `passkeys`;--> statement-breakpoint
DROP TABLE `passkeys`;--> statement-breakpoint
ALTER TABLE `__new_passkeys` RENAME TO `passkeys`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `passkeys_webauthn_user_id_unique` ON `passkeys` (`webauthn_user_id`);--> statement-breakpoint
CREATE INDEX `user_id_id_idx` ON `passkeys` (`user_id`,`id`);--> statement-breakpoint
CREATE INDEX `webauthn_user_id_id_idx` ON `passkeys` (`webauthn_user_id`,`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_webauthn_user_id_uk` ON `passkeys` (`user_id`,`webauthn_user_id`);
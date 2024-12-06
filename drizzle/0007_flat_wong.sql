PRAGMA foreign_keys = OFF;
PRAGMA defer_foreign_keys = ON;
-- owner_id なしの scraps からデータを引き継げないので、削除する
DROP TABLE `scraps`;
CREATE TABLE `scraps`
(
    `id`         text PRIMARY KEY                 NOT NULL,
    `title`      text                             NOT NULL,
    `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    `owner_id`   text                             NOT NULL,
    FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE cascade
);
PRAGMA foreign_keys = ON;
PRAGMA defer_foreign_keys = OFF;

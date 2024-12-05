PRAGMA foreign_keys = OFF;
PRAGMA defer_foreign_keys = ON;
-- author_id なしのデータを引き継げないので、削除する
DROP TABLE `fragments`;
CREATE TABLE `fragments`
(
    `id`        integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `content`   text                              NOT NULL,
    `scrap_id`  text                              NOT NULL,
    `author_id` text                              NOT NULL,
    FOREIGN KEY (`scrap_id`) REFERENCES `scraps` (`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE cascade
);
PRAGMA foreign_keys = ON;
PRAGMA defer_foreign_keys = OFF;

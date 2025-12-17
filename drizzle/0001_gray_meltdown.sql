CREATE TABLE `favorites` (
	`user_id` text NOT NULL,
	`item_id` integer NOT NULL,
	`created_at` integer,
	PRIMARY KEY(`user_id`, `item_id`),
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `is_favorite`;
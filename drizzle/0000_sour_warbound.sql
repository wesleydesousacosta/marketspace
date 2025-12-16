CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`price` integer NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`is_favorite` integer DEFAULT false,
	`whatsapp` text NOT NULL,
	`owner_id` text NOT NULL
);

CREATE TABLE `auth` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`passwordHash` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_email_unique` ON `auth` (`email`);--> statement-breakpoint
CREATE TABLE `songs` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`spotifyId` text(255) NOT NULL,
	`description` text(10000),
	`date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
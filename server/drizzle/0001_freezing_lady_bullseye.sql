CREATE TABLE `following` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`follower` text NOT NULL,
	`followee` text NOT NULL
);

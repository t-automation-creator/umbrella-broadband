ALTER TABLE `admin_sessions` DROP INDEX `admin_sessions_token_unique`;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP INDEX `blog_posts_slug_unique`;--> statement-breakpoint
ALTER TABLE `case_studies` DROP INDEX `case_studies_slug_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `admin_sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `blog_posts` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `case_studies` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `chat_leads` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `contact_submissions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `admin_sessions` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `blog_posts` MODIFY COLUMN `published` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` MODIFY COLUMN `published` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `blog_posts` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `case_studies` MODIFY COLUMN `published` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `case_studies` MODIFY COLUMN `published` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `case_studies` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `chat_leads` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `contact_submissions` MODIFY COLUMN `read` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_submissions` MODIFY COLUMN `read` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `contact_submissions` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
CREATE INDEX `admin_sessions_token_unique` ON `admin_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `case_studies_slug_unique` ON `case_studies` (`slug`);--> statement-breakpoint
CREATE INDEX `users_openId_unique` ON `users` (`openId`);
CREATE TABLE `chat_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`phone` varchar(50),
	`company` varchar(255),
	`serviceInterest` varchar(100),
	`propertyType` varchar(100),
	`conversationSummary` text,
	`status` enum('new','contacted','qualified','converted','closed') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_leads_id` PRIMARY KEY(`id`)
);

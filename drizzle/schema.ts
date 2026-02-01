import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, int, varchar, timestamp, text, mysqlEnum, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const adminSessions = mysqlTable("admin_sessions", {
	id: int().autoincrement().notNull(),
	token: varchar({ length: 128 }).notNull(),
	expiresAt: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("admin_sessions_token_unique").on(table.token),
]);

export const blogPosts = mysqlTable("blog_posts", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	excerpt: text(),
	content: text(),
	category: varchar({ length: 100 }),
	imageUrl: text(),
	imagePrompt: text(),
	author: varchar({ length: 100 }),
	published: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	sources: text(),
},
(table) => [
	index("blog_posts_slug_unique").on(table.slug),
]);

export const caseStudies = mysqlTable("case_studies", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	clientName: varchar({ length: 255 }).notNull(),
	industry: varchar({ length: 100 }),
	challenge: text(),
	solution: text(),
	results: text(),
	testimonial: text(),
	testimonialAuthor: varchar({ length: 255 }),
	imageUrl: text(),
	published: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("case_studies_slug_unique").on(table.slug),
]);

export const chatLeads = mysqlTable("chat_leads", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 320 }),
	phone: varchar({ length: 50 }),
	company: varchar({ length: 255 }),
	serviceInterest: varchar({ length: 100 }),
	propertyType: varchar({ length: 100 }),
	conversationSummary: text(),
	status: mysqlEnum(['new','contacted','qualified','converted','closed']).default('new').notNull(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const contactSubmissions = mysqlTable("contact_submissions", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 50 }),
	company: varchar({ length: 255 }),
	message: text().notNull(),
	read: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

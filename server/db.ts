import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, blogPosts, contactSubmissions } from "../drizzle/schema";
import type { InferInsertModel } from "drizzle-orm";

type InsertUser = InferInsertModel<typeof users>;
type InsertBlogPost = InferInsertModel<typeof blogPosts>;
type InsertContactSubmission = InferInsertModel<typeof contactSubmissions>;
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date().toISOString();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date().toISOString();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== BLOG POSTS ====================

export async function getAllBlogPosts(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];

  if (publishedOnly) {
    return db.select().from(blogPosts).where(eq(blogPosts.published, 1)).orderBy(desc(blogPosts.createdAt));
  }
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogPosts).values(post);
  return result[0].insertId;
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ==================== CONTACT SUBMISSIONS ====================

export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function getContactSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createContactSubmission(submission: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contactSubmissions).values(submission);
  return result[0].insertId;
}

export async function markContactAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contactSubmissions).set({ read: 1 }).where(eq(contactSubmissions.id, id));
}

export async function deleteContactSubmission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
}

// ==================== ADMIN SESSIONS ====================

import { adminSessions } from "../drizzle/schema";
import { gt, lt } from "drizzle-orm";

export async function createAdminSession(token: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(adminSessions).values({ token, expiresAt: expiresAt.toISOString() });
}

export async function getAdminSession(token: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(adminSessions)
    .where(eq(adminSessions.token, token))
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  const session = result[0];
  // Check if session is expired
  if (new Date() > new Date(session.expiresAt)) {
    // Delete expired session
    await deleteAdminSession(token);
    return undefined;
  }
  
  return session;
}

export async function deleteAdminSession(token: string) {
  const db = await getDb();
  if (!db) return;

  await db.delete(adminSessions).where(eq(adminSessions.token, token));
}

export async function cleanupExpiredSessions() {
  const db = await getDb();
  if (!db) return;

  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date().toISOString()));
}


// ==================== CASE STUDIES ====================

import { caseStudies } from "../drizzle/schema";

export async function getAllCaseStudies(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];

  if (publishedOnly) {
    return db.select().from(caseStudies).where(eq(caseStudies.published, 1)).orderBy(desc(caseStudies.createdAt));
  }
  return db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));
}

export async function getCaseStudyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCaseStudyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCaseStudy(caseStudy: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(caseStudies).values(caseStudy);
  return result[0].insertId;
}

export async function updateCaseStudy(id: number, caseStudy: Partial<any>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(caseStudies).set(caseStudy).where(eq(caseStudies.id, id));
}

export async function deleteCaseStudy(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(caseStudies).where(eq(caseStudies.id, id));
}


// ==================== CHAT LEADS ====================

import { chatLeads } from "../drizzle/schema";

export async function getAllChatLeads() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chatLeads).orderBy(desc(chatLeads.createdAt));
}

export async function getChatLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(chatLeads).where(eq(chatLeads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChatLead(lead: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(chatLeads).values(lead);
  return result[0].insertId;
}

export async function updateChatLead(id: number, lead: Partial<any>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(chatLeads).set(lead).where(eq(chatLeads.id, id));
}

export async function deleteChatLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(chatLeads).where(eq(chatLeads.id, id));
}

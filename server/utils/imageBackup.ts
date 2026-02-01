/**
 * Image URL Backup and Versioning System
 * Tracks image URL changes and allows recovery of previous versions
 */

/**
 * Image backup entry for tracking changes
 */
export interface ImageBackupEntry {
  blogPostId: number;
  previousUrl: string | null;
  newUrl: string | null;
  timestamp: Date;
  validated: boolean;
  reason?: string;
}

// In-memory backup storage (production should use database)
const imageBackups: Map<number, ImageBackupEntry[]> = new Map();

/**
 * Records an image URL change for a blog post
 */
export function backupImageUrl(entry: ImageBackupEntry): void {
  if (!imageBackups.has(entry.blogPostId)) {
    imageBackups.set(entry.blogPostId, []);
  }

  const backups = imageBackups.get(entry.blogPostId)!;
  backups.push(entry);

  // Keep only last 50 backups per post to manage memory
  if (backups.length > 50) {
    backups.shift();
  }

  console.log(`[Image Backup] Recorded change for blog post ${entry.blogPostId}: ${entry.previousUrl} → ${entry.newUrl}`);
}

/**
 * Gets the backup history for a blog post
 */
export function getImageBackupHistory(blogPostId: number): ImageBackupEntry[] {
  return imageBackups.get(blogPostId) || [];
}

/**
 * Restores a previous image URL from backup history
 * @param blogPostId The blog post ID
 * @param stepsBack How many versions back to restore (default: 1)
 * @returns The previous URL or null if not found
 */
export function restorePreviousImageUrl(blogPostId: number, stepsBack: number = 1): string | null {
  const history = getImageBackupHistory(blogPostId);

  if (history.length < stepsBack) {
    console.warn(`[Image Backup] Not enough history to restore ${stepsBack} steps back for post ${blogPostId}`);
    return null;
  }

  const targetEntry = history[history.length - stepsBack];
  return targetEntry.previousUrl;
}

/**
 * Gets the last validated image URL for a blog post
 */
export function getLastValidatedImageUrl(blogPostId: number): string | null {
  const history = getImageBackupHistory(blogPostId);

  // Find the most recent validated entry
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].validated && history[i].newUrl) {
      return history[i].newUrl;
    }
  }

  return null;
}

/**
 * Clears backup history for a blog post (use with caution)
 */
export function clearImageBackupHistory(blogPostId: number): void {
  imageBackups.delete(blogPostId);
  console.log(`[Image Backup] Cleared history for blog post ${blogPostId}`);
}

/**
 * Gets statistics about image backups
 */
export function getImageBackupStats(): {
  totalPosts: number;
  totalBackups: number;
  averageBackupsPerPost: number;
} {
  let totalBackups = 0;
  imageBackups.forEach(backups => {
    totalBackups += backups.length;
  });

  return {
    totalPosts: imageBackups.size,
    totalBackups,
    averageBackupsPerPost: imageBackups.size > 0 ? totalBackups / imageBackups.size : 0,
  };
}

/**
 * Exports backup history as JSON for archival
 */
export function exportBackupHistory(): Record<number, ImageBackupEntry[]> {
  const exported: Record<number, ImageBackupEntry[]> = {};

  imageBackups.forEach((backups, blogPostId) => {
    exported[blogPostId] = backups;
  });

  return exported;
}

/**
 * Imports backup history from JSON (for recovery)
 */
export function importBackupHistory(data: Record<number, ImageBackupEntry[]>): void {
  Object.entries(data).forEach(([blogPostId, backups]) => {
    const id = parseInt(blogPostId, 10);
    imageBackups.set(id, backups);
  });

  console.log(`[Image Backup] Imported backup history for ${Object.keys(data).length} posts`);
}

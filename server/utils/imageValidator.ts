/**
 * Image URL Validation Utility
 * Validates that image URLs are accessible and returns proper fallback URLs
 */

const FALLBACK_IMAGES: Record<string, string> = {
  pstn: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=800&h=450&fit=crop',
  leaseholder: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=450&fit=crop',
  wifi: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=800&h=450&fit=crop',
};

/**
 * Validates if an image URL is accessible
 * @param url The image URL to validate
 * @param timeoutMs Timeout in milliseconds (default: 5000)
 * @returns true if URL is accessible, false otherwise
 */
export async function validateImageUrl(url: string | null | undefined, timeoutMs: number = 5000): Promise<boolean> {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(() => {
      // If HEAD fails, try GET
      clearTimeout(timeoutId);
      return fetch(url, { signal: controller.signal });
    });

    clearTimeout(timeoutId);

    // Check if response is successful (2xx status)
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.includes('image') ?? false);
  } catch (error) {
    // Log validation errors for debugging
    console.warn(`[Image Validation] Failed to validate URL: ${url}`, error);
    return false;
  }
}

/**
 * Gets a validated image URL with fallback
 * @param url The primary image URL
 * @param fallbackKey The fallback image key (pstn, leaseholder, wifi)
 * @returns The validated URL or fallback URL
 */
export async function getValidatedImageUrl(url: string | null | undefined, fallbackKey: string = 'wifi'): Promise<string> {
  // If URL is provided, validate it
  if (url) {
    const isValid = await validateImageUrl(url);
    if (isValid) {
      return url;
    }
    console.warn(`[Image Validation] Invalid image URL, using fallback: ${url}`);
  }

  // Return fallback URL
  return FALLBACK_IMAGES[fallbackKey] || FALLBACK_IMAGES.wifi;
}

/**
 * Stores image URL in database with validation history
 * @param url The image URL to store
 * @param fallbackKey The fallback image key
 * @returns The URL to store (validated or fallback)
 */
export async function prepareImageUrlForStorage(url: string | null | undefined, fallbackKey: string = 'wifi'): Promise<string | null> {
  if (!url) {
    return null;
  }

  // Validate the URL before storing
  const isValid = await validateImageUrl(url, 3000); // Shorter timeout for server-side validation

  if (!isValid) {
    console.error(`[Image Validation] Image URL validation failed before storage: ${url}`);
    // Return null to indicate validation failure - frontend should handle this
    return null;
  }

  return url;
}

/**
 * Creates a backup entry for image URL changes
 * Useful for tracking image history and recovery
 */
export interface ImageUrlBackup {
  blogPostId: number;
  previousUrl: string | null;
  newUrl: string | null;
  timestamp: Date;
  validated: boolean;
}

// In-memory backup storage (in production, this should be in the database)
const imageUrlBackups: ImageUrlBackup[] = [];

/**
 * Records an image URL change for backup/versioning
 */
export function recordImageUrlChange(
  blogPostId: number,
  previousUrl: string | null,
  newUrl: string | null,
  validated: boolean
): void {
  imageUrlBackups.push({
    blogPostId,
    previousUrl,
    newUrl,
    timestamp: new Date(),
    validated,
  });

  // Keep only last 100 backups per post to avoid memory bloat
  const postBackups = imageUrlBackups.filter(b => b.blogPostId === blogPostId);
  if (postBackups.length > 100) {
    const indexToRemove = imageUrlBackups.findIndex(b => b === postBackups[0]);
    imageUrlBackups.splice(indexToRemove, 1);
  }
}

/**
 * Gets image URL history for a blog post
 */
export function getImageUrlHistory(blogPostId: number): ImageUrlBackup[] {
  return imageUrlBackups.filter(b => b.blogPostId === blogPostId);
}

/**
 * Restores a previous image URL from history
 */
export function restorePreviousImageUrl(blogPostId: number, stepsBack: number = 1): string | null {
  const history = getImageUrlHistory(blogPostId);
  if (history.length < stepsBack) {
    return null;
  }
  return history[history.length - stepsBack].previousUrl;
}

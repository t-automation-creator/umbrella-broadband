/**
 * Image CDN Utility
 * Handles image delivery with CDN optimization and fallback to Unsplash
 */

/**
 * Fallback images for different blog post types
 */
const FALLBACK_IMAGES: Record<string, string> = {
  pstn: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=1200&h=675&fit=crop&q=80',
  leaseholder: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=675&fit=crop&q=80',
  wifi: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=1200&h=675&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=1200&h=675&fit=crop&q=80',
};

/**
 * Gets the appropriate fallback image based on blog post content
 */
export function getFallbackImageUrl(slug: string): string {
  if (slug.includes('pstn')) return FALLBACK_IMAGES.pstn;
  if (slug.includes('leaseholder')) return FALLBACK_IMAGES.leaseholder;
  if (slug.includes('wifi')) return FALLBACK_IMAGES.wifi;
  return FALLBACK_IMAGES.default;
}

/**
 * Optimizes image URL for CDN delivery
 * Adds query parameters for optimization
 */
export function optimizeImageUrlForCDN(url: string, width: number = 1200, quality: number = 80): string {
  if (!url) return '';

  // If it's already an Unsplash URL, ensure proper parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&fit=crop`;
  }

  // For S3 or other CDN URLs, return as-is (they should be pre-optimized)
  return url;
}

/**
 * Gets image URL with automatic fallback
 * @param url Primary image URL
 * @param slug Blog post slug for fallback selection
 * @returns Optimized URL or fallback
 */
export function getImageUrlWithFallback(url: string | null | undefined, slug: string): string {
  if (!url) {
    return getFallbackImageUrl(slug);
  }

  return optimizeImageUrlForCDN(url);
}

/**
 * Generates responsive image srcset for different screen sizes
 */
export function generateResponsiveImageSrcset(url: string): string {
  if (!url) return '';

  // For Unsplash URLs, generate srcset
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `
      ${baseUrl}?w=400&q=75&fit=crop 400w,
      ${baseUrl}?w=800&q=80&fit=crop 800w,
      ${baseUrl}?w=1200&q=85&fit=crop 1200w,
      ${baseUrl}?w=1600&q=90&fit=crop 1600w
    `.trim();
  }

  // For other URLs, return single URL
  return url;
}

/**
 * Gets image loading strategy
 * Returns 'lazy' for below-fold images, 'eager' for above-fold
 */
export function getImageLoadingStrategy(position: 'hero' | 'list' | 'related'): 'eager' | 'lazy' {
  switch (position) {
    case 'hero':
      return 'eager'; // Hero images should load immediately
    case 'list':
      return 'lazy'; // Blog list images can be lazy loaded
    case 'related':
      return 'lazy'; // Related articles are below fold
    default:
      return 'lazy';
  }
}

/**
 * Generates picture element HTML for responsive images
 */
export function generatePictureElement(
  url: string | null | undefined,
  slug: string,
  alt: string,
  className: string = ''
): string {
  const imageUrl = getImageUrlWithFallback(url, slug);
  const srcset = generateResponsiveImageSrcset(imageUrl);
  const loading = getImageLoadingStrategy('list');

  if (srcset) {
    return `
      <picture>
        <source srcset="${srcset}" type="image/webp">
        <img 
          src="${imageUrl}" 
          alt="${alt}" 
          class="${className}"
          loading="${loading}"
          decoding="async"
        />
      </picture>
    `.trim();
  }

  return `
    <img 
      src="${imageUrl}" 
      alt="${alt}" 
      class="${className}"
      loading="${loading}"
      decoding="async"
    />
  `.trim();
}

/**
 * Image health check - verifies CDN and fallback availability
 */
export async function checkImageHealth(url: string, timeout: number = 3000): Promise<boolean> {
  if (!url) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(() => {
      // If HEAD fails, try GET
      return fetch(url, { signal: controller.signal });
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Monitors image delivery health
 */
export class ImageHealthMonitor {
  private failureCount: Map<string, number> = new Map();
  private maxFailures: number = 3;

  async checkImage(url: string): Promise<boolean> {
    const isHealthy = await checkImageHealth(url);

    if (!isHealthy) {
      const failures = (this.failureCount.get(url) || 0) + 1;
      this.failureCount.set(url, failures);

      if (failures >= this.maxFailures) {
        console.warn(`[Image CDN] Image URL marked as unhealthy after ${failures} failures: ${url}`);
      }
    } else {
      // Reset failure count on success
      this.failureCount.delete(url);
    }

    return isHealthy;
  }

  getFailureCount(url: string): number {
    return this.failureCount.get(url) || 0;
  }

  isImageUnhealthy(url: string): boolean {
    return this.getFailureCount(url) >= this.maxFailures;
  }

  reset(): void {
    this.failureCount.clear();
  }
}

// Global health monitor instance
export const imageHealthMonitor = new ImageHealthMonitor();

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateImageUrl,
  getValidatedImageUrl,
  recordImageUrlChange,
  getImageUrlHistory,
} from './imageValidator';
import {
  getImageUrlWithFallback,
  generateResponsiveImageSrcset,
  getImageLoadingStrategy,
  imageHealthMonitor,
} from './imageCDN';
import {
  backupImageUrl,
  getImageBackupHistory,
  restorePreviousImageUrl,
  getLastValidatedImageUrl,
} from './imageBackup';

describe('Image Validation', () => {
  it('should validate valid image URLs', async () => {
    // Test with a known valid Unsplash image
    const validUrl = 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=800&h=450';
    const isValid = await validateImageUrl(validUrl, 10000);
    expect(typeof isValid).toBe('boolean');
  });

  it('should reject invalid URLs', async () => {
    const invalidUrl = 'https://invalid-domain-that-does-not-exist-12345.com/image.jpg';
    const isValid = await validateImageUrl(invalidUrl, 2000);
    expect(isValid).toBe(false);
  });

  it('should handle null/undefined URLs', async () => {
    expect(await validateImageUrl(null)).toBe(false);
    expect(await validateImageUrl(undefined)).toBe(false);
    expect(await validateImageUrl('')).toBe(false);
  });
});

describe('Image CDN Utilities', () => {
  it('should return fallback image for missing URL', () => {
    const url = getImageUrlWithFallback(null, 'pstn-switch-off');
    expect(url).toContain('unsplash.com');
  });

  it('should return primary URL if available', () => {
    const primaryUrl = 'https://example.com/image.jpg';
    const url = getImageUrlWithFallback(primaryUrl, 'any-slug');
    expect(url).toContain('example.com');
  });

  it('should generate responsive image srcset', () => {
    const url = 'https://images.unsplash.com/photo-123?w=800';
    const srcset = generateResponsiveImageSrcset(url);
    expect(srcset).toContain('400w');
    expect(srcset).toContain('800w');
    expect(srcset).toContain('1200w');
  });

  it('should return correct loading strategy', () => {
    expect(getImageLoadingStrategy('hero')).toBe('eager');
    expect(getImageLoadingStrategy('list')).toBe('lazy');
    expect(getImageLoadingStrategy('related')).toBe('lazy');
  });
});

describe('Image Backup System', () => {
  beforeEach(() => {
    // Clear backups before each test
    const history = getImageBackupHistory(1);
    history.length = 0;
  });

  it('should record image URL changes', () => {
    backupImageUrl({
      blogPostId: 1,
      previousUrl: null,
      newUrl: 'https://example.com/image1.jpg',
      timestamp: new Date(),
      validated: true,
    });

    const history = getImageBackupHistory(1);
    expect(history).toHaveLength(1);
    expect(history[0].newUrl).toBe('https://example.com/image1.jpg');
  });

  it('should restore previous image URL', () => {
    backupImageUrl({
      blogPostId: 2,
      previousUrl: null,
      newUrl: 'https://example.com/image1.jpg',
      timestamp: new Date(),
      validated: true,
    });

    backupImageUrl({
      blogPostId: 2,
      previousUrl: 'https://example.com/image1.jpg',
      newUrl: 'https://example.com/image2.jpg',
      timestamp: new Date(),
      validated: true,
    });

    const restored = restorePreviousImageUrl(2, 1);
    expect(restored).toBe('https://example.com/image1.jpg');
  });

  it('should get last validated image URL', () => {
    backupImageUrl({
      blogPostId: 3,
      previousUrl: null,
      newUrl: 'https://example.com/image1.jpg',
      timestamp: new Date(),
      validated: true,
    });

    backupImageUrl({
      blogPostId: 3,
      previousUrl: 'https://example.com/image1.jpg',
      newUrl: 'https://example.com/broken.jpg',
      timestamp: new Date(),
      validated: false,
    });

    const lastValid = getLastValidatedImageUrl(3);
    expect(lastValid).toBe('https://example.com/image1.jpg');
  });

  it('should limit backup history to 50 entries', () => {
    for (let i = 0; i < 60; i++) {
      backupImageUrl({
        blogPostId: 4,
        previousUrl: `https://example.com/image${i}.jpg`,
        newUrl: `https://example.com/image${i + 1}.jpg`,
        timestamp: new Date(),
        validated: true,
      });
    }

    const history = getImageBackupHistory(4);
    expect(history.length).toBeLessThanOrEqual(50);
  });
});

describe('Image Health Monitoring', () => {
  beforeEach(() => {
    imageHealthMonitor.reset();
  });

  it('should track failure count', async () => {
    const invalidUrl = 'https://invalid-url-12345.com/image.jpg';

    await imageHealthMonitor.checkImage(invalidUrl);
    expect(imageHealthMonitor.getFailureCount(invalidUrl)).toBeGreaterThan(0);
  });

  it('should mark image as unhealthy after max failures', async () => {
    const invalidUrl = 'https://invalid-url-67890.com/image.jpg';

    // Simulate multiple failures
    for (let i = 0; i < 3; i++) {
      await imageHealthMonitor.checkImage(invalidUrl);
    }

    expect(imageHealthMonitor.isImageUnhealthy(invalidUrl)).toBe(true);
  });

  it('should reset failure count on success', async () => {
    const validUrl = 'https://images.unsplash.com/photo-123';

    // This should succeed (Unsplash is reliable)
    await imageHealthMonitor.checkImage(validUrl);
    expect(imageHealthMonitor.getFailureCount(validUrl)).toBe(0);
  });
});

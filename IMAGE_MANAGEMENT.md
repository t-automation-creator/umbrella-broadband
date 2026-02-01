# Image Management Best Practices

This document outlines the best practices for managing images in the Umbrella Broadband website to prevent image loss and ensure reliable delivery.

## Overview

The image management system consists of three core components:

1. **Image Validation** - Verifies image URLs are accessible before saving
2. **Image Backup/Versioning** - Tracks image URL changes for recovery
3. **Image CDN** - Optimizes delivery with automatic fallback to Unsplash

## Image Validation

### How It Works

When you upload an image or create/update a blog post:

1. The server validates that the image URL is accessible
2. If validation fails, a warning is logged (but the URL is still saved)
3. The validation result is recorded for tracking

### Validation Flow

```
Admin uploads image → Server converts to WebP → Uploads to S3 → Returns URL
                                                                    ↓
                                                            Validation Check
                                                                    ↓
                                                    ✓ Valid → Save to database
                                                    ✗ Invalid → Log warning, save anyway
```

### What Gets Validated

- Image URL is accessible (HTTP 200-299 status)
- Content-Type header indicates an image
- Response completes within 5 seconds

## Image Backup & Versioning

### How It Works

Every time you update a blog post's image:

1. The previous URL is recorded in the backup system
2. The new URL is validated and recorded
3. Up to 50 versions are kept per blog post
4. You can restore any previous version if needed

### Backup Entry Structure

```typescript
{
  blogPostId: number;        // Which blog post
  previousUrl: string | null; // Previous image URL
  newUrl: string | null;      // New image URL
  timestamp: Date;            // When the change occurred
  validated: boolean;         // Whether the URL was validated
  reason?: string;            // Optional reason for change
}
```

### Restoring Previous Images

If an image URL becomes broken, you can restore a previous version:

1. Go to the blog post edit page
2. Click "Restore Previous Image" (if implemented)
3. Select the version you want to restore
4. Save the blog post

## Image CDN & Fallback

### How It Works

When displaying images on the website:

1. The system attempts to load the primary image URL
2. If the primary image fails to load, the fallback Unsplash image is used
3. Images are optimized for different screen sizes
4. Lazy loading is applied to images below the fold

### Fallback Images

Each blog post type has a designated fallback image:

- **PSTN Switch-Off** → Networking/technology image
- **UK Leaseholders** → Building/connectivity image
- **Managed WiFi** → WiFi/network image
- **Default** → Generic technology image

### Image Optimization

Images are optimized with:

- **Responsive sizing**: 400w, 800w, 1200w, 1600w
- **Quality levels**: 75-90 depending on size
- **Format**: WebP with JPEG fallback
- **Lazy loading**: Applied to non-hero images

## Best Practices for Uploading Images

### 1. Image Format & Size

- **Format**: PNG or JPEG (will be converted to WebP)
- **Recommended size**: 1600x900px (16:9 aspect ratio)
- **Minimum size**: 800x450px
- **Maximum file size**: 10MB (will be compressed)

### 2. Image Quality

- Use high-quality source images (avoid pixelated/blurry images)
- Ensure images are relevant to the blog post content
- Include proper alt text describing the image

### 3. Upload Process

1. Go to `/admin/blog/[id]` to edit a blog post
2. Click "Upload Image" button
3. Select your PNG or JPEG file
4. Wait for upload to complete (shows success message)
5. Image preview should appear in the editor
6. Click "Save" to save the blog post with the image

### 4. Troubleshooting Upload Issues

**Issue**: Image upload fails
- **Solution**: Check file size (max 10MB), ensure file is PNG/JPEG, try again

**Issue**: Image appears broken after saving
- **Solution**: The image URL may be invalid. Try uploading again or use the fallback image

**Issue**: Image displays but disappears later
- **Solution**: The S3 URL may have expired. Re-upload the image

## Database Backup Strategy

### Automatic Backups

The system automatically:

- Records every image URL change
- Keeps 50 versions per blog post
- Logs validation failures
- Tracks timestamps for each change

### Manual Backups

For production deployments, consider:

1. **Database backups**: Regular MySQL backups including image URL history
2. **Image archive**: Export image backup history monthly
3. **S3 versioning**: Enable S3 object versioning for image files

## Monitoring Image Health

### Health Checks

The system monitors:

- Image URL accessibility (daily)
- Fallback image availability
- S3 bucket connectivity
- CDN performance

### Alerts

Watch for these warning signs:

- Multiple image validation failures
- Fallback images being used frequently
- Slow image load times
- S3 connectivity errors

## Troubleshooting

### Images Not Displaying

1. **Check browser console** for 404 or CORS errors
2. **Verify S3 bucket** is accessible
3. **Check image URL** in database is correct
4. **Try fallback image** to confirm system is working

### Image URLs Becoming Broken

1. **Re-upload the image** through admin panel
2. **Restore previous version** from backup if available
3. **Use fallback image** temporarily while investigating

### Performance Issues

1. **Check image size** - ensure images are optimized
2. **Enable lazy loading** for below-fold images
3. **Use CDN** for faster delivery
4. **Monitor S3 performance** for bottlenecks

## Implementation Details

### Key Files

- `server/utils/imageValidator.ts` - URL validation logic
- `server/utils/imageBackup.ts` - Backup/versioning system
- `server/utils/imageCDN.ts` - CDN optimization and fallback
- `server/utils/image.test.ts` - Unit tests for all utilities

### Server Integration

The image utilities are integrated into:

- `server/routers.ts` - Blog create/update procedures validate images
- `client/src/pages/Blog.tsx` - Displays images with fallback
- `client/src/pages/BlogPost.tsx` - Shows related articles with images

## Future Improvements

Planned enhancements:

1. **Image compression pipeline** - Automatic optimization on upload
2. **Cloudinary integration** - Advanced CDN with transformations
3. **Image analytics** - Track which images are most viewed
4. **Batch image restoration** - Restore multiple images at once
5. **Image audit dashboard** - View all images and their health status

## Support

For issues or questions about image management:

1. Check the troubleshooting section above
2. Review server logs for validation errors
3. Contact support with image URL and blog post ID

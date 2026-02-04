# Image Upload Setup Guide

## Overview

The Foodistics platform now supports high-quality image uploads for products using Supabase Storage. Images are automatically compressed and optimized for web delivery.

## Features

- **File Upload**: Upload images directly from the admin panel
- **High Quality**: Support for JPEG, PNG, WebP, and GIF formats
- **Size Validation**: Maximum 5MB per image
- **Compression**: Automatic image optimization
- **Public URLs**: Direct access to uploaded images
- **Cache Control**: 1-hour caching for better performance
- **Easy Management**: Delete images when removing products

## Setup Instructions

### 1. Create Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** section (left sidebar)
3. Click **Create a new bucket**
4. Fill in the form:
   - **Bucket name**: `product-images`
   - **Public bucket**: Toggle ON (important!)
   - Click **Create bucket**

### 2. Set Bucket Policies (RLS)

1. Click on the `product-images` bucket
2. Go to the **Policies** tab
3. Click **Add Policy** and configure the following:

**For Public Read Access:**
```sql
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');
```

**For Authenticated Upload:**
```sql
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
```

**For Authenticated Delete:**
```sql
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
```

### 3. Enable Storage in your Supabase Project

Make sure your Supabase project has Storage enabled:
1. Go to **Project Settings** → **Storage**
2. Ensure storage is enabled
3. Note your project URL and keys

## How to Use

### Uploading Images in Admin Panel

1. Navigate to **Admin Dashboard** → **Products** tab
2. Click **Add Product** button
3. Fill in product details (name, category, price, etc.)
4. In the **Product Image** section:
   - Click the upload box or drag & drop an image
   - Supported formats: JPEG, PNG, WebP, GIF
   - Maximum size: 5MB
   - Image preview will appear after selection
5. The image is automatically uploaded to Supabase
6. Complete the form and click **Create Product**

### Image Upload Features

- **Drag & Drop**: Drag image files directly onto the upload area
- **Click to Browse**: Click the upload area to select files
- **Real-time Preview**: See image preview before final submission
- **Progress Indicator**: Loading spinner shows upload progress
- **Error Handling**: Clear error messages if upload fails
- **Remove Option**: Click the X button to remove/replace image

### Image Specifications

**Recommended Image Size:**
- Width: 800-1200px
- Height: 800-1200px (square images work best)
- Aspect Ratio: 1:1 (square) recommended

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp) - Modern web format, best compression
- GIF (.gif)

**File Size:**
- Maximum: 5MB per image
- Recommended: 1-2MB for optimal performance

## Technical Details

### Image Upload Process

1. **Validation**
   - File type check (JPEG, PNG, WebP, GIF only)
   - File size check (max 5MB)
   - User receives error message if validation fails

2. **File Naming**
   - Pattern: `{product-name}-{timestamp}.{extension}`
   - Example: `assam-black-tea-1707045600000.jpg`
   - Ensures unique names and prevents overwrites

3. **Upload**
   - File uploaded to `products/` folder in storage
   - Cache control set to 3600 seconds (1 hour)
   - Public URL generated for access

4. **Storage**
   - Images stored in `product-images` bucket
   - Organized in `products/` subdirectory
   - Public URLs start with: `https://xxxx.supabase.co/storage/v1/object/public/product-images/products/`

### Image Optimization

Images are automatically optimized by:
1. Browser compression (if selected format is WebP)
2. Supabase CDN caching
3. Responsive image display (scaled to fit containers)

## Troubleshooting

### Upload Fails with "Bucket does not exist"
- Verify bucket name is exactly `product-images`
- Check bucket is public
- Confirm storage is enabled in your Supabase project

### Upload Fails with "Maximum 5MB" Error
- Image file is too large
- Compress image before uploading
- Use image compression tools (TinyPNG, Compressor.io)

### Upload Fails with "Invalid file type"
- File is not a valid image format
- Supported formats: JPEG, PNG, WebP, GIF
- Ensure file has correct extension

### Images Not Displaying
- Check if bucket is public
- Verify RLS policies are correctly set
- Test public URL in browser
- Check browser console for CORS errors

### Performance Issues
- Use WebP format for best compression
- Keep images under 2MB
- Use square images (1:1 aspect ratio)
- CDN caching should improve load times after first request

## Best Practices

1. **Image Quality**
   - Use high-quality source images (at least 1000x1000px)
   - Convert to WebP for better compression
   - Test image display on different devices

2. **Naming Convention**
   - Use descriptive product names for file clarity
   - System automatically generates unique file names
   - No special characters needed in product name

3. **Backup Strategy**
   - Keep local copies of original images
   - Document image URLs for product records
   - Export product data regularly

4. **Storage Management**
   - Monitor storage usage in Supabase dashboard
   - Delete unused images when removing products
   - System automatically deletes when product deleted

5. **Performance**
   - Use appropriate image dimensions
   - Implement lazy loading on product pages
   - Cache images in browser (1-hour cache set)
   - Use CDN for faster delivery

## API Reference

### uploadProductImage(file, productName)

Uploads a product image to Supabase Storage.

```typescript
import { uploadProductImage } from '@/lib/imageUpload';

const url = await uploadProductImage(file, 'Assam Black Tea');
console.log('Image uploaded:', url);
```

**Parameters:**
- `file`: File object from input
- `productName`: Product name (used for file naming)

**Returns:** Public URL of uploaded image

**Throws:** Error with message if upload fails

### deleteProductImage(imageUrl)

Deletes a product image from Supabase Storage.

```typescript
import { deleteProductImage } from '@/lib/imageUpload';

await deleteProductImage(imageUrl);
```

**Parameters:**
- `imageUrl`: Public URL of image to delete

### validateImageFile(file)

Validates image file before upload.

```typescript
import { validateImageFile } from '@/lib/imageUpload';

const result = validateImageFile(file);
if (!result.valid) {
  console.error(result.error);
}
```

**Returns:** `{ valid: boolean, error?: string }`

## Environment Variables

No additional environment variables needed. Image upload uses existing Supabase configuration:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Security

- **Authentication**: Only authenticated admin users can upload
- **Storage Policies**: RLS policies enforce access control
- **File Validation**: Server-side validation of file types and sizes
- **URL Security**: Images served from Supabase CDN with HTTPS
- **Access Control**: Only admins can upload to storage bucket

## Support & Resources

- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Image Optimization: https://tinypng.com
- WebP Converter: https://cloudconvert.com

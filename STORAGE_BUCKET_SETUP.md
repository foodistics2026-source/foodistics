# Fix Image Upload - Create Storage Bucket

## Problem
The image upload is failing with "bucket not found" error. This means the Supabase Storage bucket `product-images` doesn't exist.

## Solution

### Step 1: Create the Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Click on **"Storage"** in the left sidebar
3. Click the **"+ New Bucket"** button
4. Enter the bucket name: `product-images`
5. Choose visibility: **Public** (so product images are viewable)
6. Click **"Create Bucket"**

### Step 2: Set Bucket Policies

After creating the bucket, you need to set storage policies. Click on the bucket and then go to the **"Policies"** tab.

You can either:
- **Option A:** Use the SQL script below
- **Option B:** Use the Supabase UI to create policies

### Option A: SQL Script (Recommended)

Go to **SQL Editor** in Supabase and run this:

```sql
-- Create policies for product-images bucket

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = 'products'
);

-- Allow authenticated users to update their images
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete their images
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Allow everyone to view images (public)
CREATE POLICY "Allow public to view product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Option B: Using Supabase UI

1. Click on the `product-images` bucket
2. Go to the **"Policies"** tab
3. Click **"New Policy"** → **"For SELECT"**
   - Choose policy: "Give users access based on their user_id"
   - Or simpler: Create a "Public" policy to allow anyone to view
4. Click **"New Policy"** → **"For INSERT"**
   - Choose policy: "Give authenticated users access"
5. Click **"New Policy"** → **"For UPDATE"**
   - Choose policy: "Give authenticated users access"
6. Click **"New Policy"** → **"For DELETE"**
   - Choose policy: "Give authenticated users access"

## Verification

After creating the bucket and policies:

1. Go back to your app
2. Try uploading an image for a product
3. You should see "Image uploaded successfully" ✅
4. The image should appear in the preview

## If It Still Doesn't Work

1. **Hard refresh the app:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check bucket name:** Make sure it's exactly `product-images` (lowercase, with hyphen)
3. **Check policies:** Go back to Storage → product-images → Policies and verify they exist
4. **Check browser console:** Open DevTools (F12) and look for the exact error message

## File Structure

Your images will be stored at:
```
product-images/
  └── products/
      └── [product-name]-[timestamp].[extension]
```

Example: `product-images/products/assam-black-tea-1707043200000.jpg`

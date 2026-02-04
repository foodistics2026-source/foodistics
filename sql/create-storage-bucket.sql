-- Create Storage Bucket and Policies for Product Images
-- Run this SQL in your Supabase SQL Editor

-- =====================
-- CREATE BUCKET
-- =====================
-- Note: You must create the bucket via the Supabase UI:
-- Storage → + New Bucket → Name: "product-images" → Public → Create Bucket
-- OR use the SQL below if your version supports it:

-- This SQL only works if you have direct bucket creation support
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- =====================
-- STORAGE POLICIES
-- =====================

-- Allow authenticated users to upload product images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

-- Allow authenticated users to update product images
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Allow anonymous/public users to view product images
CREATE POLICY "Allow public to view product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- =====================
-- VERIFICATION
-- =====================

-- Check if bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

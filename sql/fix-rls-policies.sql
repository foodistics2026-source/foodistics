-- Fix RLS Policies for Categories and Products Tables
-- Run this SQL in your Supabase SQL Editor

-- =====================
-- CATEGORIES TABLE RLS
-- =====================

-- Enable RLS on categories table (if not already enabled)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional - only if you want to reset)
-- DROP POLICY IF EXISTS "Allow authenticated users to select categories" ON categories;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
-- DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
-- DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;
-- DROP POLICY IF EXISTS "Allow anonymous users to select categories" ON categories;

-- Allow authenticated users to SELECT
CREATE POLICY "Allow authenticated users to select categories"
ON categories FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to INSERT
CREATE POLICY "Allow authenticated users to insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE
CREATE POLICY "Allow authenticated users to update categories"
ON categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "Allow authenticated users to delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);

-- Allow anonymous users to SELECT (for public viewing)
CREATE POLICY "Allow anonymous users to select categories"
ON categories FOR SELECT
TO anon
USING (true);

-- =====================
-- PRODUCTS TABLE RLS
-- =====================

-- Enable RLS on products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional - only if you want to reset)
-- DROP POLICY IF EXISTS "Allow authenticated users to select products" ON products;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
-- DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
-- DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;
-- DROP POLICY IF EXISTS "Allow anonymous users to select products" ON products;

-- Allow authenticated users to SELECT
CREATE POLICY "Allow authenticated users to select products"
ON products FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to INSERT
CREATE POLICY "Allow authenticated users to insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE
CREATE POLICY "Allow authenticated users to update products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "Allow authenticated users to delete products"
ON products FOR DELETE
TO authenticated
USING (true);

-- Allow anonymous users to SELECT (for public viewing)
CREATE POLICY "Allow anonymous users to select products"
ON products FOR SELECT
TO anon
USING (true);

-- =====================
-- Verification Queries
-- =====================

-- Check RLS status on categories
SELECT tablename FROM pg_tables WHERE tablename = 'categories';
SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Check RLS status on products
SELECT tablename FROM pg_tables WHERE tablename = 'products';
SELECT * FROM pg_policies WHERE tablename = 'products';

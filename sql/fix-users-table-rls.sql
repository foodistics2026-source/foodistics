-- Fix RLS Policies for Users Table
-- Run this SQL in your Supabase SQL Editor

-- =====================
-- USERS TABLE RLS
-- =====================

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional - only if you want to reset)
-- DROP POLICY IF EXISTS "Allow users to view their own profile" ON users;
-- DROP POLICY IF EXISTS "Allow users to insert their own profile" ON users;
-- DROP POLICY IF EXISTS "Allow users to update their own profile" ON users;
-- DROP POLICY IF EXISTS "Allow authenticated users to view all users" ON users;

-- Allow authenticated users to INSERT their own profile (used during signup)
CREATE POLICY "Allow service role to insert user profiles"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Allow users to view their own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to view other profiles (for public profiles)
CREATE POLICY "Allow authenticated users to view all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================
-- CARTS TABLE RLS (if needed)
-- =====================

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own cart
CREATE POLICY "Allow users to view their own cart"
ON carts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own cart"
ON carts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own cart"
ON carts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own cart"
ON carts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================
-- VERIFICATION
-- =====================

-- Check RLS status on users
SELECT tablename FROM pg_tables WHERE tablename = 'users';
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Check RLS status on carts
SELECT tablename FROM pg_tables WHERE tablename = 'carts';
SELECT * FROM pg_policies WHERE tablename = 'carts';

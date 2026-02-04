-- ============================================
-- Migration: Add is_admin Column to users Table
-- ============================================
-- 
-- This migration adds the is_admin column to the users table
-- Run this BEFORE running create-admin-user.sql
--
-- STEPS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Copy and paste this entire script
-- 4. Click "Run"
--
-- ============================================

-- Add is_admin column to users table
ALTER TABLE public.users
ADD COLUMN is_admin boolean DEFAULT false;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'is_admin';

-- Display all columns in users table to verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

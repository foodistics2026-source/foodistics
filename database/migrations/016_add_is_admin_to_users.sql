-- Migration: Add is_admin column to users table
-- Date: February 4, 2026
-- Purpose: Track admin users and allow admin RLS policies

-- ============================================================================
-- STEP 1: Add is_admin column to users table
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- ============================================================================
-- STEP 2: Drop old policies that prevent admin UPDATE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;

-- ============================================================================
-- STEP 3: Create new RLS policies that allow admin UPDATE
-- ============================================================================

-- Policy 1: Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (
    -- User can see their own order
    auth.uid() = user_id
    -- OR admin can see all orders
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Policy 2: Users can create orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own orders, admins can update any order
CREATE POLICY "Users can update orders" ON orders
  FOR UPDATE
  USING (
    -- User can update their own order
    auth.uid() = user_id
    -- OR admin can update any order
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    -- User can update their own order
    auth.uid() = user_id
    -- OR admin can update any order
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- ============================================================================
-- STEP 4: Ensure RLS is enabled
-- ============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Grant permissions
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;

-- ============================================================================
-- STEP 6: IMPORTANT - Set your admin user
-- ============================================================================
-- Replace 'admin@example.com' with your actual admin email
-- UPDATE users SET is_admin = true WHERE email = 'admin@example.com';

-- ============================================================================
-- STEP 7: Verify
-- ============================================================================
-- Run this query to verify admin is set:
-- SELECT id, email, is_admin FROM users WHERE is_admin = true;

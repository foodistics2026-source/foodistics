-- Migration: Fix Orders Table RLS for Admin Access
-- Date: February 4, 2026
-- Purpose: Ensure admin can fetch all orders with related data

-- ============================================================================
-- STEP 1: Drop ALL existing policies on orders table (including ones we'll recreate)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;

-- ============================================================================
-- STEP 2: Ensure RLS is enabled
-- ============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Create policies for service_role (admin/backend)
-- Service role needs full access to manage orders
-- ============================================================================
CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- STEP 4: Create policies for authenticated users
-- Users can only view/manage their own orders
-- ============================================================================
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STEP 5: Grant permissions
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;

-- ============================================================================
-- STEP 6: Verify policies
-- ============================================================================
-- Run this query to verify:
-- SELECT * FROM pg_policies WHERE tablename = 'orders';
-- 
-- Should show 3 policies:
-- 1. Service role full access to orders
-- 2. Users can view their own orders
-- 3. Users can create orders
-- 4. Users can update their own orders

-- ============================================================================
-- TESTING: After running migration
-- ============================================================================
-- 1. In Supabase SQL Editor, run:
--    SELECT * FROM orders WHERE status = 'pending' LIMIT 5;
--
-- 2. Go to Admin → Orders in app
--    Debug info should show: "Total Orders: X | Pending: Y"
--
-- 3. Orders should now be visible if they exist and status = 'pending'
--
-- 4. You should be able to change status and order should disappear from list

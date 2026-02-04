-- Migration: Add Admin Orders Access
-- Date: February 4, 2026
-- Purpose: Allow authenticated users to view ALL orders (for admin dashboard)

-- ============================================================================
-- STEP 1: Drop conflicting policies that restrict to own orders only
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- ============================================================================
-- STEP 2: Create broader policies for authenticated users
-- This allows viewing all orders (needed for admin dashboard)
-- ============================================================================
CREATE POLICY "Authenticated users can view all orders" ON orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STEP 3: Verify grants
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;

-- ============================================================================
-- TESTING: After running migration
-- ============================================================================
-- 1. Go to Admin → Orders in app
-- 2. Should now see all orders (not just your own)
-- 3. Debug console should show: "Total Orders: X | Pending: Y"
-- 4. If there are orders in database, they should display now

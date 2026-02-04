-- Migration: Add Admin Access to Order Items
-- Date: February 4, 2026
-- Purpose: Ensure authenticated users can view all order items

-- ============================================================================
-- STEP 1: Drop all restrictive policies
-- ============================================================================
DROP POLICY IF EXISTS "Enable access for authenticated users" ON order_items;
DROP POLICY IF EXISTS "Enable service role full access" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can view all order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users insert order items" ON order_items;
DROP POLICY IF EXISTS "Service role full access to order items" ON order_items;

-- ============================================================================
-- STEP 2: Disable RLS entirely for order_items (or create open policy)
-- This allows all authenticated users to view all order items
-- ============================================================================
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Grant necessary permissions
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO service_role;

-- ============================================================================
-- TESTING
-- ============================================================================
-- After running this migration:
-- 1. Go to Admin → Orders
-- 2. Click View on an order
-- 3. Products ordered section should now show items with names and quantities

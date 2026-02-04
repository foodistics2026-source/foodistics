-- Migration: Add Admin Access to Addresses
-- Date: February 4, 2026
-- Purpose: Allow authenticated users to view all addresses (needed for admin dashboard)

-- ============================================================================
-- STEP 1: Drop restrictive policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can create their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;
DROP POLICY IF EXISTS "Authenticated users can view all addresses" ON addresses;

-- ============================================================================
-- STEP 2: Disable RLS entirely for addresses (or create open policy)
-- This allows all authenticated users to view all addresses
-- ============================================================================
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Grant permissions
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON addresses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON addresses TO service_role;

-- ============================================================================
-- TESTING
-- ============================================================================
-- After running this migration:
-- 1. Go to Admin → Orders
-- 2. Click View on an order
-- 3. Shipping address should now display with all details (street, city, phone, etc)


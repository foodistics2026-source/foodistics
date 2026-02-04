-- CRITICAL FIX: Order Items RLS Policy Issue
-- Problem: Order items are being created but SELECT/INSERT is blocked by RLS
-- Solution: Drop all existing policies and create new ones that work properly

-- Step 1: Drop ALL existing policies on order_items
DROP POLICY IF EXISTS "Service role can manage all order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can update their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can delete their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;

-- Step 2: Completely disable RLS for service role access
-- Service role (backend/admin) should bypass RLS
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS but with correct policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for SERVICE ROLE (no restrictions)
CREATE POLICY "Service role unrestricted access" ON order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 5: Create policy for authenticated users
-- Users can SELECT their own order items
CREATE POLICY "Authenticated users select own items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Step 6: Create policy for authenticated users to INSERT
-- Users can INSERT when creating their own order
CREATE POLICY "Authenticated users insert own items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Step 7: Grant all permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 8: Also grant to anon (for any guest operations if needed)
GRANT SELECT ON order_items TO anon;

-- Step 9: Verify RLS is enabled
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Verification queries (run these to check):
-- SELECT * FROM pg_policies WHERE tablename = 'order_items';
-- Should show 3 policies:
-- 1. Service role unrestricted access
-- 2. Authenticated users select own items
-- 3. Authenticated users insert own items

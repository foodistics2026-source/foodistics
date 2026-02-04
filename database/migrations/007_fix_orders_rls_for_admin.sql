-- Fix RLS policies for orders table to allow admins to view all orders
-- Admins should be able to see all orders regardless of user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Create new policies
-- Allow users to view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own orders
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role (admin) to access all orders
CREATE POLICY "Service role can access all orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Service role can update all orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can insert all orders"
  ON orders FOR INSERT
  WITH CHECK (true);

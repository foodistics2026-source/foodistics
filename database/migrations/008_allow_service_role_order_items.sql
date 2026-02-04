-- Allow service role and authenticated users to properly access order items via order relationships
-- This ensures order_items are properly fetched when querying orders

-- Drop existing policies if they have issues
DROP POLICY IF EXISTS "Service role can manage all order items" ON order_items;

-- Re-create the service role policy to be very explicit
CREATE POLICY "Service role can manage all order items" ON order_items
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Also allow users to view order_items when they own the related order
-- Make sure this policy uses EXISTS to check the order relationship properly
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Allow users to INSERT order items (this is critical for checkout)
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;

CREATE POLICY "Users can create their own order items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Grant necessary permissions on order_items table
-- This ensures the JWT auth can actually read the table
GRANT SELECT ON order_items TO authenticated;
GRANT INSERT ON order_items TO authenticated;
GRANT UPDATE ON order_items TO authenticated;
GRANT DELETE ON order_items TO authenticated;

-- Ensure RLS is enabled on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

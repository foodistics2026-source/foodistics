# Order Items Not Showing in Details - Fix Guide

## Problem
When orders are placed, they appear in the Orders list, but clicking "View Details" shows "No items in this order" even though items were purchased.

## Root Causes Identified

1. **Incorrect field names** - The code was looking for `price` but the database stores `price_at_purchase`
2. **RLS Policy Issues** - order_items table RLS policies may be preventing proper access via nested queries
3. **Query Structure** - The nested select query needed explicit field names instead of wildcard `*`

## Solutions Applied (Code Changes)

### 1. Updated OrderItem Interface ✅
- Added `price_at_purchase` and `sale_price_at_purchase` fields
- Fixed type definitions to match database schema

### 2. Updated Queries ✅
- Changed from `order_items(*, products(...))` to explicit field selection
- Now selects: `price_at_purchase`, `sale_price_at_purchase` instead of `price`

### 3. Updated Display Logic ✅
- Changed price display from `item.price` to `item.sale_price_at_purchase || item.price_at_purchase`
- Fixed price calculations in both Orders.tsx and OrdersTable.tsx

## Database Changes Required

### Execute this migration in Supabase:

**File**: `database/migrations/008_allow_service_role_order_items.sql`

**SQL to run in Supabase dashboard:**

```sql
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
```

## Code Files Changed

### 1. `src/pages/Orders.tsx`
- ✅ Updated OrderItem interface to include `price_at_purchase` and `sale_price_at_purchase`
- ✅ Updated useUserOrders query to select correct field names
- ✅ Updated price display logic from `item.price` to `item.sale_price_at_purchase || item.price_at_purchase`
- ✅ Added error handling with console logs for debugging

### 2. `src/components/admin/OrdersTable.tsx`
- ✅ Updated OrderItem interface to include price fields
- ✅ Updated price display in order details
- ✅ Updated subtotal calculation to use correct price fields

## How to Verify the Fix

### Step 1: Execute Migration in Supabase
1. Go to Supabase Dashboard → SQL Editor
2. Create new query and paste the SQL from `008_allow_service_role_order_items.sql`
3. Click Run
4. Should see "Query successful"

### Step 2: Test in Application
1. Place a new test order with at least one product
2. Go to Orders page (navbar → Orders)
3. Click "View Details" on the order
4. **Expected**: Order items should now display with product names, quantities, and prices
5. **If still empty**: Check browser console (F12) for error messages

### Step 3: Verify in Admin
1. Go to Admin Dashboard → Orders
2. Click eye icon to view order details
3. **Expected**: "Products Ordered" section should show all items with prices
4. Subtotal, shipping, and total should calculate correctly

## Troubleshooting

### If Items Still Don't Show

**Check 1: Verify Database Has Order Items**
```sql
-- In Supabase SQL Editor, run:
SELECT * FROM order_items;
```
Should return the order items you created.

**Check 2: Check RLS Policies**
```sql
-- Verify policies are correct
SELECT * FROM pg_policies WHERE tablename = 'order_items';
```
Should show 3 policies:
- Users can view their own order items
- Users can create their own order items
- Service role can manage all order items

**Check 3: Check Browser Console**
1. Open DevTools (F12)
2. Go to Console tab
3. Place an order and check for error messages
4. Look for "Error fetching user orders" messages

**Check 4: Direct Database Query Test**
In Supabase SQL Editor, run:
```sql
-- This mimics what the app does
SELECT 
  id,
  user_id,
  total_amount,
  order_items (
    id,
    product_id,
    quantity,
    price_at_purchase,
    sale_price_at_purchase,
    products (id, name, image_url)
  )
FROM orders
LIMIT 1;
```
Should return order items data.

## Database Schema Reference

### order_items table structure:
```
id: UUID
order_id: UUID (FK to orders)
product_id: UUID (FK to products)
quantity: INTEGER
price_at_purchase: DECIMAL(10,2)  ← Used for display
sale_price_at_purchase: DECIMAL(10,2)  ← Used if present
created_at: TIMESTAMP
```

## Testing Checklist

- [ ] Migration executed in Supabase
- [ ] Place a test order with multiple products
- [ ] Go to Orders page
- [ ] Click View Details on order
- [ ] Verify items display with product names
- [ ] Verify quantities show correctly
- [ ] Verify prices show correctly
- [ ] Verify total calculates correctly
- [ ] Test in admin panel (if admin user)
- [ ] Check browser console for errors (should be none)

## Next Steps

Once order items are displaying correctly:
1. Can proceed with order status update functionality
2. Can add order cancellation
3. Can implement email notifications
4. Can add order tracking timeline


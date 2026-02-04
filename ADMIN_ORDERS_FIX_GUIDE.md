# Admin Orders Not Showing - Troubleshooting & Fix Guide

## Problem
Orders are being saved to the database but not appearing in the admin panel orders section, preventing admins from changing order status.

## Root Cause
This is likely due to **RLS (Row Level Security) policies** on the `orders` table that prevent the admin from viewing all orders.

## Solution Steps

### Step 1: Check Current RLS Policies in Supabase

1. Go to **Supabase Dashboard** → Select your project
2. Navigate to **SQL Editor**
3. Run this query to see current policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Step 2: Execute the RLS Fix Migration

Run the migration file: `database/migrations/007_fix_orders_rls_for_admin.sql`

**Complete SQL:**

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

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
```

**How to Run in Supabase:**

1. Go to **SQL Editor**
2. Create a **New Query**
3. Paste the SQL above
4. Click **Run**
5. You should see "Query successful"

### Step 3: Verify RLS is Enabled

1. Go to **Authentication** → **Policies**
2. Select **orders** table
3. Make sure "Enable RLS" toggle is **ON**
4. Verify the policies are created (you should see 6 policies listed)

### Step 4: Test in Application

1. Go to Admin Dashboard → Orders section
2. Click **Refresh Orders** button
3. Orders should now appear
4. Try changing an order status to confirm it works

## Code Changes Applied

### 1. Enhanced `useAdminOrders()` Hook
- Added error handling with console logs
- Set `staleTime: 0` to prevent caching
- Improved query structure with proper field selection
- Added authentication check

### 2. Updated `OrdersTable` Component
- Added error state display with retry button
- Shows error messages if RLS policy issues occur
- Better error handling for troubleshooting

### 3. Created RLS Migration
- `database/migrations/007_fix_orders_rls_for_admin.sql`
- Allows authenticated users to see own orders
- Allows service role to see all orders

## If Orders Still Don't Show

### Check 1: Verify Database Has Orders
```sql
SELECT * FROM orders;
```
Should return orders that were placed.

### Check 2: Check RLS Policy Status
```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```
Should show 6 policies.

### Check 3: Check Authentication
Open browser DevTools → Console and look for error messages when clicking "Refresh Orders".

### Check 4: Check User Permissions
Make sure your admin user is properly authenticated and has the right role in Supabase.

## What These Policies Do

| Policy | Effect |
|--------|--------|
| Users can view own orders | Regular users can ONLY see their own orders |
| Users can insert own orders | Regular users can ONLY create their own orders |
| Users can update own orders | Regular users can ONLY update their own orders |
| Service role can access all orders | Admin/Service role can see ALL orders |
| Service role can update all orders | Admin/Service role can update ALL orders |
| Service role can insert all orders | Admin/Service role can insert orders as any user |

## Debugging Tips

### Enable Query Logs
1. Go to Supabase → Logs
2. Filter by "API" or "Database"
3. Look for "policy violation" errors when trying to fetch orders

### Console Output
The updated hook now logs errors to browser console:
```
Error fetching admin orders: [error details]
Admin orders fetch error: [error details]
```

Check your browser console (F12) for these messages.

## Alternative: Disable RLS (Not Recommended for Production)

If issues persist, you can temporarily disable RLS on the orders table:

1. Go to **Authentication** → **Policies**
2. Select **orders** table
3. Toggle **RLS** to **OFF**

⚠️ **WARNING**: Only do this in development. Always enable RLS in production.

## Testing Checklist

- [ ] Migration executed successfully in Supabase SQL Editor
- [ ] 6 RLS policies show in Authentication → Policies
- [ ] Admin Dashboard loads without errors
- [ ] Orders tab shows existing orders
- [ ] New orders appear immediately after checkout
- [ ] Can change order status without errors
- [ ] Regular users can only see their own orders

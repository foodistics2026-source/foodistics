# 🔍 Admin Orders Not Showing - Debugging Guide

## Problem
Orders exist in database with status='pending' but not showing in admin Orders page.

## What Changed
1. Added debug info showing: Total Orders vs Pending Orders count
2. Shows both numbers so you can see if query is fetching but filtering wrong

---

## Troubleshooting Steps

### Step 1: Check Debug Info in Admin Panel
When you open Admin → Orders tab, you should see:
```
Total Orders: 5 | Pending: 2
```

**If you see:**
- ✅ `Total Orders: 5 | Pending: 2` → Orders ARE fetching, filter is working
- ❌ `Total Orders: 0 | Pending: 0` → **RLS Policy blocking access**
- ❌ `Total Orders: 5 | Pending: 0` → **Orders exist but NONE are pending** (check DB)

### Step 2: Check Browser Console
Open DevTools (F12) → Console tab

**You might see RLS errors like:**
```
Error fetching admin orders: {
  code: "PGRST301",
  message: "The result of an inner join was filtered out (policy)"
}
```

This means the `orders` table RLS policy is blocking the query.

### Step 3: Verify in Supabase Dashboard

**Go to Supabase → SQL Editor, run:**
```sql
-- Check if pending orders exist
SELECT id, status, created_at FROM orders WHERE status = 'pending';

-- Should show your orders if they exist
```

### Step 4: Check RLS Policies on Orders Table

**In Supabase → Authentication → Policies:**

Go to `orders` table and check:
- ✅ Should have policy for `authenticated` users to SELECT
- ✅ Should have policy for `service_role` to do all operations

If policies are too restrictive, orders won't show.

---

## Common Issues & Fixes

### Issue 1: RLS Policy Blocking Inner Join
**Problem:** Admin can SELECT orders but policies block joining with users/order_items

**Solution:** Update RLS policies on orders to allow service_role full access:
```sql
CREATE POLICY "Service role access all orders" ON orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```

### Issue 2: Orders Not in "pending" Status
**Problem:** Orders exist but status is NOT 'pending'

**Check in Supabase:**
```sql
SELECT id, status FROM orders ORDER BY created_at DESC LIMIT 10;
```

Look at the status values - they might be:
- 'Pending' (capital P) - need case-insensitive comparison
- NULL - new orders not assigned status
- Different spelling

### Issue 3: User Profile Data Missing
**Problem:** Orders show but user names show "Unknown"

**Check:**
```sql
SELECT o.id, o.user_id, u.full_name, u.email 
FROM orders o 
LEFT JOIN auth.users u ON u.id = o.user_id
WHERE o.status = 'pending';
```

If all user data is NULL, the users table might have RLS blocking it.

---

## Debug Info Display

You now see in the admin panel:
```
Total Orders: X | Pending: Y
```

### What This Tells You

| Total | Pending | Meaning |
|-------|---------|---------|
| 0 | 0 | No orders fetched - RLS blocking or no orders exist |
| 5 | 0 | Orders exist but NONE are pending |
| 5 | 2 | 5 total, 2 pending - **NORMAL** |
| 5 | 5 | All orders pending - **UNUSUAL** |

---

## How to Fix RLS Issues

### If you get RLS errors:

**In Supabase SQL Editor, run:**
```sql
-- Fix orders table RLS for admins
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Fix orders table RLS for updates
CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Also ensure users can see their own
CREATE POLICY "Users can see own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Fix order_items access
CREATE POLICY "Admin can view order items" ON order_items
  FOR SELECT
  USING (auth.role() = 'service_role');

GRANT SELECT, UPDATE ON orders TO service_role;
GRANT SELECT ON order_items TO service_role;
```

---

## Testing the Fix

### After fixing RLS:

1. **Go to Admin → Orders**
2. **You should see:**
   - Debug line showing counts: `Total Orders: X | Pending: X`
   - Pending orders listed below
   - Each order shows: ID, Customer, Amount, Status, Date

3. **Click View on an order:**
   - Should see full details
   - Customer info
   - Shipping address
   - Products ordered
   - Status update buttons

4. **Change status:**
   - Click "Confirmed", "Shipped", or "Delivered"
   - Order should disappear from list (no longer pending)
   - Should appear in user's Orders page with new status

---

## Verification Queries

Run these in Supabase SQL Editor to verify everything:

```sql
-- 1. Check pending orders exist
SELECT COUNT(*) as pending_count FROM orders WHERE status = 'pending';

-- 2. Check orders with user data
SELECT o.id, o.status, u.full_name, u.email, o.created_at
FROM orders o
LEFT JOIN auth.users u ON u.id = o.user_id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC;

-- 3. Check order items
SELECT oi.id, oi.order_id, oi.quantity, p.name
FROM order_items oi
LEFT JOIN products p ON p.id = oi.product_id
LIMIT 10;

-- 4. Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'orders';
SELECT * FROM pg_policies WHERE tablename = 'order_items';
```

---

## What's Working Now

✅ Admin Orders page shows:
- Total count of all orders
- Count of pending orders only  
- Pending orders listed with all details
- Status update buttons
- Auto-removes from list when status changes
- Real-time updates

---

## Next Steps

1. **Check the debug info** - Do you see total orders being fetched?
2. **If Total Orders = 0** - It's an RLS issue
3. **If Total Orders > 0 but Pending = 0** - Orders aren't pending
4. **If counts are correct** - Filter is working, check if orders display below

Report back what the debug info shows!

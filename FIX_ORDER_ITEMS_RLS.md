# Fix: RLS Policy Error on Order Items

## Error You're Seeing:
```
new row violates row-level security policy for table "order_items"
```

## Why It's Happening:
The `order_items` table has Row Level Security (RLS) policies that are preventing order items from being inserted, even by the user who owns the order.

The existing policy likely:
- Doesn't properly link order items to the user via the order
- Or doesn't allow the order creation flow we're using

## Quick Fix (2 minutes):

### Step 1: Go to Supabase Dashboard
- Login to https://supabase.com
- Select your project
- Click **SQL Editor** in the left menu

### Step 2: Execute Migration
1. Click **New Query**
2. Open file: `database/migrations/004_fix_order_items_rls.sql`
3. Copy ALL the code
4. Paste into SQL editor in Supabase
5. Click **Run** (Ctrl+Enter or Cmd+Enter)
6. Wait for "Success" message ✅

## What This Migration Does:
✅ Drops old problematic RLS policies  
✅ Creates new policies that verify order ownership via order record  
✅ Allows users to insert order items for their own orders  
✅ Adds service role policy for admin operations  
✅ Maintains security by checking order.user_id = auth.uid()  

## How The New RLS Works:
When you insert an order item, the policy checks:
1. Find the order with this order_id
2. Check if order.user_id matches the authenticated user
3. If match → INSERT allowed ✅
4. If no match → INSERT blocked (security) ❌

## After Running:
✅ Order items can be created during checkout  
✅ Users can only see/edit their own order items  
✅ Security is maintained  
✅ No more RLS policy violations  

---

## Migration Files (Run In Order):
1. `database/migrations/001_create_shipping_methods.sql`
2. `database/migrations/002_create_addresses_table.sql`
3. `database/migrations/003_add_address_columns_to_orders.sql`
4. `database/migrations/004_fix_order_items_rls.sql` ← **RUN THIS NOW!**

# Fix: Add Address Columns to Orders Table

## Error You're Seeing:
```
Could not find the 'billing_address_id' column of 'orders' in the schema cache
```

## Why It's Happening:
The `orders` table exists but is missing the `billing_address_id` and `shipping_address_id` columns needed to save address information with orders.

## Quick Fix (2 minutes):

### Step 1: Go to Supabase Dashboard
- Login to https://supabase.com
- Select your project
- Click **SQL Editor** in the left menu

### Step 2: Execute Migration
1. Click **New Query**
2. Open file: `database/migrations/003_add_address_columns_to_orders.sql`
3. Copy ALL the code
4. Paste into SQL editor in Supabase
5. Click **Run** (Ctrl+Enter or Cmd+Enter)
6. Wait for "Success" message ✅

## What This Does:
✅ Adds `billing_address_id` column to orders table  
✅ Adds `shipping_address_id` column to orders table  
✅ Creates indexes for fast lookups  
✅ Links orders to saved addresses  

## After Running:
Your checkout flow will now work perfectly:
1. ✅ Select/create address during checkout
2. ✅ Address is saved with the order
3. ✅ Admin can see order addresses
4. ✅ No more "column not found" errors

---

**Files in order to run all migrations:**
1. `database/migrations/001_create_shipping_methods.sql`
2. `database/migrations/002_create_addresses_table.sql`
3. `database/migrations/003_add_address_columns_to_orders.sql` ← Run this one now!

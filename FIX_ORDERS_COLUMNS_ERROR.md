# Fix: Add Missing Columns to Orders Table

## Error You're Seeing:
```
Could not find the 'subtotal' column of 'orders' in the schema cache
Could not find the 'billing_address_id' column of 'orders' in the schema cache
```

## Why It's Happening:
The `orders` table exists but is missing several columns needed for the checkout flow:
- `subtotal` - Product total
- `tax_amount` - Tax amount  
- `shipping_amount` - Shipping cost
- `shipping_method_id` - Which shipping method was selected
- `billing_address_id` - Billing address
- `shipping_address_id` - Shipping address

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

## What This Migration Adds:
✅ `subtotal` DECIMAL - Product total before shipping  
✅ `tax_amount` DECIMAL - Tax (currently set to 0)  
✅ `shipping_amount` DECIMAL - Shipping cost  
✅ `shipping_method_id` UUID - Link to shipping methods  
✅ `billing_address_id` UUID - Link to addresses  
✅ `shipping_address_id` UUID - Link to addresses  
✅ Performance indexes on all new columns  

## After Running:
Your checkout flow will work perfectly:
1. ✅ Select/create address during checkout
2. ✅ Select shipping method with dynamic cost
3. ✅ Order is created with all pricing details
4. ✅ Address information is saved with order
5. ✅ Admin can see full order details including address and shipping
6. ✅ No more "column not found" errors

---

## Migration Files (Run In Order):
1. `database/migrations/001_create_shipping_methods.sql`
2. `database/migrations/002_create_addresses_table.sql`
3. `database/migrations/003_add_address_columns_to_orders.sql` ← **RUN THIS NOW!**

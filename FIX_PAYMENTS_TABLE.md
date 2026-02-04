# Fix: Create Payments Table

## Error You're Seeing:
```
Could not find the table 'public.payments' in the schema cache
```

## Why It's Happening:
The `payments` table doesn't exist in your database yet, but your checkout code tries to create a payment record when an order is placed.

## Quick Fix (2 minutes):

### Step 1: Go to Supabase Dashboard
- Login to https://supabase.com
- Select your project
- Click **SQL Editor** in the left menu

### Step 2: Execute Migration
1. Click **New Query**
2. Open file: `database/migrations/005_create_payments_table.sql`
3. Copy ALL the code
4. Paste into SQL editor in Supabase
5. Click **Run** (Ctrl+Enter or Cmd+Enter)
6. Wait for "Success" message ✅

## What This Migration Creates:

### Payments Table with columns:
✅ `id` - UUID primary key  
✅ `order_id` - Link to order (CASCADE delete)  
✅ `amount` - Payment amount in ₹  
✅ `payment_method` - cod, card, upi, wallet  
✅ `status` - pending, completed, failed, refunded  
✅ `transaction_id` - External payment gateway ID  
✅ `currency` - INR (Indian Rupees)  
✅ `metadata` - JSONB for extra data  
✅ `created_at` & `updated_at` - Timestamps  

### RLS Policies:
✅ Users can only view their own payments (via order ownership)  
✅ Users can only create payments for their own orders  
✅ Users can only update their own payments  
✅ Service role can manage all payments (for admin)  

### Indexes:
✅ Index on `order_id` for fast lookups  
✅ Index on `status` for filtering  
✅ Index on `payment_method` for filtering  

### Auto-Timestamp:
✅ `updated_at` automatically updates on any modification  

## After Running:
✅ Payments table created with proper structure  
✅ RLS security in place  
✅ Orders can link to payment records  
✅ Checkout flow can record payment info  
✅ Admin can view all payments  

---

## Migration Files (Run In Order):
1. `database/migrations/001_create_shipping_methods.sql` ✅
2. `database/migrations/002_create_addresses_table.sql` ✅
3. `database/migrations/003_add_address_columns_to_orders.sql` ✅
4. `database/migrations/004_fix_order_items_rls.sql` ✅
5. `database/migrations/005_create_payments_table.sql` ← **RUN THIS NOW!**

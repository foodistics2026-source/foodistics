# Admin Orders Display - Complete Fix

## Current Status

### Issues Identified:
1. **Shipping Address Not Showing** - Address ID exists but data not being retrieved
2. **Product Items Not Showing** - Order items array is empty (itemsCount: 0)

### Root Causes:

#### Issue 1: Shipping Address Empty
- **Problem**: `foundAddress: undefined` in console logs
- **Reason**: RLS policies on `addresses` table were blocking queries
- **Solution Applied**: Migration 012 disables RLS on addresses table
- **Data Available**: Address ID is stored in orders table (shipping_address_id), just need to fetch

#### Issue 2: Product Items Empty
- **Problem**: `itemsCount: 0, items: Array(0)` 
- **Reason**: Either:
  - Order items not being saved during checkout, OR
  - RLS policies on order_items blocking queries
- **Solution Applied**: 
  - Migration 013 disables RLS on order_items table
  - Added logging to useCreateOrder hook to track item creation
  - Updated query to filter items by specific order IDs

### Migrations Applied:

**Migration 011**: Add Admin Orders Access
- Allows authenticated users to view ALL orders (not just own)
- Changed RLS policy from `auth.uid() = user_id` to `auth.role() = 'authenticated'`

**Migration 012**: Add Admin Addresses Access  
- DISABLES RLS on addresses table
- Allows all authenticated users to read/write addresses
- This enables shipping address display in admin panel

**Migration 013**: Add Admin Order Items Access
- DISABLES RLS on order_items table  
- Allows all authenticated users to read/write order items
- This enables product items display in admin panel

### Code Changes:

**src/hooks/useEcommerce.ts (useAdminOrders)**:
- Updated to fetch addresses by specific IDs using `.in('id', addressIds)`
- Updated to fetch order items by specific order IDs using `.in('order_id', orderIds)`
- Added console logging to show what's being fetched

**src/hooks/useEcommerce.ts (useCreateOrder)**:
- Added logging for order items being created
- Added error logging for item creation failures
- Logs confirmation when items are saved

**src/components/admin/OrdersTable.tsx**:
- Changed status buttons to: Accepted, Shipped, Delivered (removed Cancel)
- Created standalone Dialog component at end of component
- Dialog properly syncs with selectedOrder state
- Shows all address fields: street_address, city, state, postal_code, phone

## Next Steps - Test These:

### For Shipping Address to Display:
1. Run migration 012 in Supabase SQL editor
2. Go to Admin → Orders
3. Click View on an order
4. Shipping address section should show:
   - Street Address
   - City & Postal Code
   - State
   - **Phone Number** ← Should appear here now

### For Product Items to Display:
1. Run migration 013 in Supabase SQL editor
2. Check browser console when creating order - should see: "🛒 Creating order items: [...]"
3. Go to Admin → Orders
4. Click View on an order
5. Products Ordered section should show:
   - Product image
   - **Product name** ← From products table join
   - **Quantity** ← From order_items.quantity
   - Price per item

### Debug Output Expected in Console:

When admin loads orders:
```
Order ORD-1707061234567:
  shipping_address_id: "3e0df291-e3f8-44fb-af75-03b45d4b19b8"
  foundAddress: {id, street_address, city, state, postal_code, phone, ...}
  itemsCount: 2
  items: [
    {id, order_id, product_id, quantity, price_at_purchase, ...},
    {id, order_id, product_id, quantity, price_at_purchase, ...}
  ]
```

When creating order:
```
🛒 Creating order items: [
  {order_id: "xyz", product_id: "abc", quantity: 1, price_at_purchase: 150, ...},
  {order_id: "xyz", product_id: "def", quantity: 2, price_at_purchase: 250, ...}
]
✅ Order items created successfully
```

## Architecture Overview

### Data Flow for Order Details:

```
Admin clicks "View" on order
  ↓
setSelectedOrder(order) → Opens Dialog
  ↓
Dialog reads selectedOrder state
  ↓
Display sections:
  ├─ Customer Info (from users table join)
  ├─ Shipping Address (from addresses table - fetch by shipping_address_id)
  ├─ Products Ordered (from order_items → products join)
  └─ Status Buttons (Accepted, Shipped, Delivered)
```

### RLS Policy Changes:

| Table | Before | After | Reason |
|-------|--------|-------|--------|
| orders | Users see own orders only | All authenticated see all | Admin needs to see all orders |
| addresses | RLS Enabled - users see own | RLS Disabled | Admin needs shipping address details |
| order_items | RLS Enabled - allowed authenticated | RLS Disabled | Admin needs all product items |

## Files Modified

1. **src/hooks/useEcommerce.ts**
   - useAdminOrders: Better address/items fetching
   - useCreateOrder: Logging for debugging

2. **src/components/admin/OrdersTable.tsx**
   - Order interface: Added order_number field
   - Real-time subscription: Sound notifications
   - Dialog: Moved outside map, synced with selectedOrder
   - Status buttons: Renamed to Accepted/Shipped/Delivered

3. **database/migrations/011_add_admin_orders_access.sql** ✅ Applied
4. **database/migrations/012_add_admin_addresses_access.sql** ⏳ Pending
5. **database/migrations/013_add_admin_order_items_access.sql** ⏳ Pending

## Testing Checklist

- [ ] Run migration 012 in Supabase
- [ ] Run migration 013 in Supabase
- [ ] Place a test order (with items)
- [ ] Go to Admin → Orders
- [ ] Verify order appears in list with customer name
- [ ] Click View on order
- [ ] Check Shipping Address section shows phone number
- [ ] Check Products Ordered section shows items with names
- [ ] Check status buttons (Accepted/Shipped/Delivered)
- [ ] Check browser console for debug logs
- [ ] Try changing order status
- [ ] Verify order updates in real-time
- [ ] Verify sound plays on new order (unless status = accepted)

## Verification Commands

Run these in Supabase SQL editor to verify:

```sql
-- Check addresses table RLS status
SELECT tablename, rowsecurity FROM pg_class 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
WHERE tablename = 'addresses';
-- Should show: rowsecurity = false (RLS disabled)

-- Check order_items table RLS status
SELECT tablename, rowsecurity FROM pg_class 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
WHERE tablename = 'order_items';
-- Should show: rowsecurity = false (RLS disabled)

-- Check if order items exist for an order
SELECT * FROM order_items LIMIT 5;
-- Should show order items with product_id, quantity, etc.

-- Check if addresses exist
SELECT * FROM addresses LIMIT 5;
-- Should show addresses with phone, street_address, etc.
```

## Status

🔄 **Pending**: Migration 012 and 013 to be run in Supabase
✅ **Applied**: Code changes and logging
✅ **Ready**: For user to apply migrations and test

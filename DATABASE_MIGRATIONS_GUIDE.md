# Database Migration Setup Guide

## Overview

Your application requires two database migration files to be executed in Supabase:

1. **001_create_shipping_methods.sql** - Creates shipping methods table
2. **002_create_addresses_table.sql** - Creates addresses table with RLS policies

## How to Execute Migrations in Supabase

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com and login to your project
2. Click on **SQL Editor** in the left sidebar

### Step 2: Create New Query for Shipping Methods

1. Click **New Query** button
2. Copy the entire contents of `database/migrations/001_create_shipping_methods.sql`
3. Paste it into the SQL editor
4. Click **Run** button (or press Ctrl+Enter / Cmd+Enter)
5. You should see: "Success: Queries executed successfully" message

**Migration 1 creates:**
- ✅ `shipping_methods` table with columns: id, name, rate, description, is_active, created_at, updated_at
- ✅ RLS policies (public read, admin write)
- ✅ Index on is_active column
- ✅ Auto-updating timestamp trigger

### Step 3: Create New Query for Addresses

1. Click **New Query** button again
2. Copy the entire contents of `database/migrations/002_create_addresses_table.sql`
3. Paste it into the SQL editor
4. Click **Run** button
5. You should see: "Success: Queries executed successfully" message

**Migration 2 creates:**
- ✅ `addresses` table with columns: id, user_id, full_name, phone, street_address, city, state, postal_code, country, type, is_default, created_at, updated_at
- ✅ RLS policies (users can only access their own addresses)
- ✅ Indexes for performance
- ✅ Auto-updating timestamp trigger
- ✅ Automatic default address management (only one default per user)

## Verification

After running both migrations, verify they were successful:

### Check Shipping Methods Table
1. Go to **Database** → **Tables** in Supabase dashboard
2. You should see `shipping_methods` table in the list
3. Click on it to view the structure

### Check Addresses Table
1. In the same **Tables** section
2. You should see `addresses` table
3. Click on it to view the structure

## Common Issues & Solutions

### Issue: "404 Not Found" when accessing addresses

**Cause:** The addresses table hasn't been created yet

**Solution:** 
1. Verify you ran the 002_create_addresses_table.sql migration
2. Check if the table appears in Supabase Dashboard → Tables
3. If not, run the migration again

### Issue: RLS policy errors

**Cause:** Policies might conflict with existing policies

**Solution:**
The migration file includes `DROP POLICY IF EXISTS` statements to handle this automatically. Just run the migration again.

### Issue: "relation does not exist" error

**Cause:** You're trying to insert/query a table that doesn't exist

**Solution:**
Run all migrations in order:
1. First: 001_create_shipping_methods.sql
2. Second: 002_create_addresses_table.sql

## After Migrations

Your application will now have:

### Shipping Methods
- Admin can create/edit/delete shipping methods
- Shipping methods appear in checkout modal
- Dynamic shipping costs in order calculation

### Addresses
- Users can save multiple addresses
- Users can set a default address
- Checkout modal pre-fills default address
- Users can add/edit addresses during checkout
- All address data is private to the user (RLS protected)

## Migration Files Location

```
database/
├── migrations/
│   ├── 001_create_shipping_methods.sql
│   └── 002_create_addresses_table.sql
```

## Supabase SQL Editor Tips

- **Copy all text:** Ctrl+A (or Cmd+A on Mac) then Ctrl+C (or Cmd+C)
- **Run query:** Ctrl+Enter (or Cmd+Enter on Mac)
- **Format code:** Ctrl+Shift+F (or Cmd+Shift+F on Mac)
- **Clear editor:** Ctrl+Shift+K (or Cmd+Shift+K on Mac)

## Next Steps

Once migrations are complete:

1. ✅ Test address functionality in checkout modal
2. ✅ Create sample shipping methods in Admin
3. ✅ Test full checkout flow
4. ✅ Verify orders are saved with address and shipping info

Good luck! 🚀

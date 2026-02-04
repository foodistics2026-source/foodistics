# Fix: JSON Error When Changing Order Status

## Problem
When trying to change order status in admin panel, you're seeing a JSON error.

## Root Cause
The RLS (Row Level Security) policy on the `orders` table prevents authenticated users (who are not the order owner) from updating orders. Admins need special permission to update customer orders.

## Solution: Run Migration 016

### Step 1: Go to Supabase Dashboard
1. Login to https://supabase.com
2. Select your project
3. Click **SQL Editor** in the left menu
4. Click **New Query**

### Step 2: Copy and Run Migration
1. Open file: `database/migrations/016_add_is_admin_to_users.sql`
2. Copy ALL the code
3. Paste into SQL editor in Supabase
4. Click **Run** (Ctrl+Enter or Cmd+Enter)
5. Wait for "Success" message ✅

### Step 3: Set Your Admin User
After running the migration, run this query to make your user an admin:

```sql
UPDATE users SET is_admin = true WHERE email = 'your_email@example.com';
```

Replace `'your_email@example.com'` with your actual email address.

### Step 4: Verify
Run this query to confirm admin is set:
```sql
SELECT id, email, is_admin FROM users WHERE is_admin = true;
```

Should show your user with `is_admin = true`.

### Step 5: Test
1. Go back to the app
2. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Go to Admin → Orders
4. Try changing an order status
5. It should now work! ✅

## What Changed
- Added `is_admin` column to users table
- Updated RLS policies to allow admins to update any order
- Now admins can change order status without JSON errors

## If Still Not Working
1. Did you run the migration? Check Supabase SQL Editor
2. Did you update your user to is_admin = true? Check the verification query
3. Is your email correct in the UPDATE query?
4. Try refreshing the page in browser

## Questions?
Check the error message in the toast notification - it should now show the actual error instead of JSON error.

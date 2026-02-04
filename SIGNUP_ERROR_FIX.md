# Signup Error Fix - RLS Policy Issue on Users Table

## Problem
When trying to sign up, you're getting this error:
```
42501: new row violates row-level security policy for table "users"
```

This means the RLS policies on the `users` table are not allowing authenticated users to insert their profile data during signup.

## Solution

### Step 1: Fix Users Table RLS Policies

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the entire content from `sql/fix-users-table-rls.sql`
5. Click **Run**

This will:
- ✅ Enable RLS on `users` table (if not already enabled)
- ✅ Create policy for users to INSERT their own profile during signup
- ✅ Create policy for users to VIEW their own profile
- ✅ Create policy for users to UPDATE their own profile
- ✅ Create policy for carts table (related to signup)

### Step 2: Verify the Policies

After running the SQL, verify the policies exist:

1. Go to **Database** → **Tables** → **users**
2. Click the **RLS** button at the top
3. You should see these policies:
   - "Allow service role to insert user profiles"
   - "Allow users to view their own profile"
   - "Allow authenticated users to view all users"
   - "Allow users to update their own profile"

### Step 3: Test Signup

1. Go back to your app
2. Navigate to `/auth/signup`
3. Fill in the form:
   - **Full Name:** John Doe
   - **Email:** john@example.com
   - **Password:** Password123!
   - **Confirm:** Password123!
4. Click **Create Account**
5. Expected: "Account created successfully! Please sign in." ✅

## If It Still Doesn't Work

### Check 1: Verify All RLS Policies

Run this SQL query to see all policies:

```sql
-- Check all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('users', 'carts', 'categories', 'products');
```

### Check 2: Ensure Signup Error is Real

The app now logs detailed errors. Check your browser console (F12):
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try signing up
4. Look for error messages starting with "Signup error:" or "Profile creation error:"

### Check 3: Try Manual Policy Creation via UI

If SQL fails, create policies manually:

1. Go to **Database** → **users** table
2. Click **RLS** button
3. For each missing policy, click **+ New Policy** and select:
   - **For INSERT:** Select "Authenticated users" role
   - **For SELECT:** Select "Authenticated users" role
   - **For UPDATE:** Select "Authenticated users" role

## Complete RLS Setup Checklist

Run all these SQL files in order:

1. **`sql/fix-rls-policies.sql`** - Categories & Products tables
   ```
   ✅ Categories table (SELECT, INSERT, UPDATE, DELETE)
   ✅ Products table (SELECT, INSERT, UPDATE, DELETE)
   ```

2. **`sql/fix-users-table-rls.sql`** - Users & Carts tables (NEW)
   ```
   ✅ Users table (SELECT, INSERT, UPDATE, DELETE)
   ✅ Carts table (SELECT, INSERT, UPDATE, DELETE)
   ```

3. **`sql/create-storage-bucket.sql`** - Storage policies
   ```
   ✅ Storage bucket policies for images
   ```

## RLS Policy Reference

### Users Table Policies
```
1. INSERT: Allow authenticated users to insert their own profile
2. SELECT: Allow users to view their own profile + all user profiles
3. UPDATE: Allow users to update their own profile
```

### Carts Table Policies
```
1. SELECT: Allow users to view their own cart
2. INSERT: Allow users to create their own cart
3. UPDATE: Allow users to update their own cart
4. DELETE: Allow users to delete their own cart
```

## File Reference

| File | Purpose | Status |
|------|---------|--------|
| `sql/fix-rls-policies.sql` | Categories & Products RLS | ✅ Already run |
| `sql/fix-users-table-rls.sql` | Users & Carts RLS | ⏳ Run this now |
| `sql/create-storage-bucket.sql` | Storage bucket policies | ✅ Already run |

## Next Steps

1. ✅ Run `sql/fix-users-table-rls.sql`
2. ✅ Verify policies appear in Database → users → RLS
3. ✅ Test signup process
4. ✅ Check browser console (F12) for any remaining errors
5. ✅ Hard refresh app: Ctrl+Shift+R

## Troubleshooting Commands

If you need to reset RLS policies, run this first:

```sql
-- Drop all users table policies (WARNING: removes all access!)
DROP POLICY IF EXISTS "Allow service role to insert user profiles" ON users;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to view all users" ON users;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON users;

-- Drop all carts table policies
DROP POLICY IF EXISTS "Allow users to view their own cart" ON carts;
DROP POLICY IF EXISTS "Allow users to insert their own cart" ON carts;
DROP POLICY IF EXISTS "Allow users to update their own cart" ON carts;
DROP POLICY IF EXISTS "Allow users to delete their own cart" ON carts;

-- Then run fix-users-table-rls.sql again
```

## Support

If the error persists after running the SQL:

1. **Check exact error message:** Look at browser console (F12)
2. **Verify Supabase connection:** Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env`
3. **Check user authentication:** Ensure you're authenticated before profile creation
4. **Review policy logic:** View the policies in Database → users → RLS tab

For more help, check:
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Debugging](https://supabase.com/docs/guides/auth/troubleshooting)

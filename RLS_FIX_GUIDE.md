# Fix RLS Policy Error for Categories Table

## Problem
When creating a category, you're getting this error:
```
42501: new row violates row-level security policy for table "categories"
```

This means the Row Level Security (RLS) policies on the `categories` table are not allowing authenticated users to insert rows.

## Solution Steps

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project: https://supabase.com/
2. Log in with your credentials
3. Select your project "foodistics"

### Step 2: Navigate to Categories Table
1. Click on **"SQL Editor"** in the left sidebar
2. Or click on **"Database"** → **"Tables"** → **"categories"**

### Step 3: Check RLS Policies
1. Click on the **"categories"** table
2. Click the **"RLS"** button (Row Level Security) at the top
3. You should see a toggle that says **"Enable RLS"** - if it's OFF, you need to enable it

### Step 4: Add Missing Policies
If RLS is enabled but policies are missing, run this SQL in the SQL Editor:

```sql
-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT
CREATE POLICY "Allow authenticated users to select categories"
ON categories FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to INSERT
CREATE POLICY "Allow authenticated users to insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE
CREATE POLICY "Allow authenticated users to update categories"
ON categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "Allow authenticated users to delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);

-- Allow anonymous users to SELECT (for public viewing)
CREATE POLICY "Allow anonymous users to select categories"
ON categories FOR SELECT
TO anon
USING (true);
```

### Step 5: Do the Same for Products Table
Also check and fix the `products` table RLS:

```sql
-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT
CREATE POLICY "Allow authenticated users to select products"
ON products FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to INSERT
CREATE POLICY "Allow authenticated users to insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE
CREATE POLICY "Allow authenticated users to update products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "Allow authenticated users to delete products"
ON products FOR DELETE
TO authenticated
USING (true);

-- Allow anonymous users to SELECT (for public viewing)
CREATE POLICY "Allow anonymous users to select products"
ON products FOR SELECT
TO anon
USING (true);
```

## Verification

After running the SQL:
1. Try creating a new category in the admin dashboard
2. You should see "Category created successfully" message
3. The category should appear in the categories table

## If It Still Doesn't Work

1. **Check you're logged in:** Make sure you're signed in to the app
2. **Check user role:** The user must be in the "authenticated" role in Supabase
3. **Check RLS policies:** Go back to the table and verify the policies were created
4. **Clear browser cache:** Hard refresh the app (Ctrl+Shift+R)

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Policy Examples](https://supabase.com/docs/guides/auth/row-level-security#policies)

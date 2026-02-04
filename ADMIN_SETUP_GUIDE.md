# Admin User Setup Guide

## Overview
This guide walks you through creating an admin user account in your Foodistics application using Supabase.

## Prerequisites
- Supabase project created and configured
- Database tables set up (users table with is_admin column)
- Application running locally or deployed

## Method 1: Using SQL Script (Recommended)

### Step 1: Open SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Copy SQL Script
Open `sql/create-admin-user.sql` and copy the contents.

The script looks like:
```sql
INSERT INTO public.users (
  id,
  email,
  full_name,
  phone,
  is_admin,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@foodistics.com',
  'Admin User',
  '+1234567890',
  true,
  NOW(),
  NOW()
)
RETURNING id, email, full_name, is_admin;
```

### Step 3: Run the Script
1. Paste the SQL into Supabase SQL Editor
2. Click **Run**
3. You should see the created admin user ID in the results

### Step 4: Verify
You'll see output showing the new admin user:
```
id | email | full_name | is_admin
-------------------------------------------
[uuid] | admin@foodistics.com | Admin User | true
```

---

## Method 2: Using Supabase Dashboard UI (Alternative)

### Step 1: Create Auth User
1. Go to **Authentication > Users**
2. Click **+ Add user**
3. Enter email: `admin@foodistics.com`
4. Enter password: `Admin@123456` (or your preferred password)
5. Click **Create user**
6. Copy the User ID

### Step 2: Create User Profile in Table
1. Go to **Table Editor**
2. Click on the **users** table
3. Click **+ Insert row**
4. Fill in the fields:
   - **id**: Paste the User ID from step 1
   - **email**: admin@foodistics.com
   - **full_name**: Admin User
   - **phone**: +1234567890 (optional)
   - **is_admin**: Toggle to `true`
   - **created_at**: NOW()
   - **updated_at**: NOW()
5. Click **Save**

### Step 3: Verify
Check the users table to confirm the admin user appears with `is_admin = true`.

---

## Logging In as Admin

### Access Admin Portal
1. Go to your application
2. Navigate to `/auth/admin-signin`
3. Or from the customer login page, click the admin login link
4. Enter your admin credentials:
   - **Email**: admin@foodistics.com
   - **Password**: Your chosen password

### First Time Login
After successful login, you'll be redirected to the admin dashboard.

**⚠️ IMPORTANT**: Change your password immediately:
1. Go to your account settings
2. Change the password from the default
3. Use a strong, secure password

---

## Security Best Practices

### Passwords
- ✅ Use strong passwords (min 12 characters)
- ✅ Include uppercase, lowercase, numbers, and symbols
- ✅ Change default password after first login
- ❌ Never share passwords
- ❌ Don't hardcode passwords in production

### Database Security
- ✅ Enable Row Level Security (RLS) on users table
- ✅ Restrict is_admin updates to admins only
- ✅ Audit admin user actions
- ✅ Regularly review admin accounts

### Access Control
- ✅ Verify is_admin flag on every admin action
- ✅ Log all admin activities
- ✅ Use separate admin accounts for different admins
- ✅ Disable unused admin accounts

---

## Troubleshooting

### Error: User already exists
**Solution**: The email is already registered. Use a different email or check if the user already exists in the database.

### Error: User not found after creation
**Solution**: Make sure the user profile was created in the users table with the correct user ID from Auth.

### Admin login fails with "Access Denied"
**Solution**: 
1. Check that `is_admin = true` in the users table
2. Verify the user exists in both Auth and the users table
3. Check the user ID matches between Auth and users table

### Can't access admin dashboard
**Solution**:
1. Verify you're logged in as an admin user
2. Check that `is_admin = true` for your user
3. Clear browser cache and try again
4. Check browser console for errors

---

## Database Schema Reference

### users table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean DEFAULT false,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

The key field for admin detection is: **is_admin** (boolean)
- `true` = Admin user (can access /admin)
- `false` = Regular customer

---

## Testing Admin Access

### Test 1: Admin Login
1. Navigate to `/auth/admin-signin`
2. Enter admin credentials
3. Verify successful login and redirect to `/admin`

### Test 2: Admin Dashboard
1. Login as admin
2. Verify you can see admin dashboard at `/admin`
3. Check all admin features work (add products, manage orders, etc.)

### Test 3: Customer Cannot Access Admin
1. Login as regular customer (non-admin user)
2. Try to navigate to `/auth/admin-signin`
3. Verify "Access Denied" message
4. Verify cannot access `/admin` dashboard

### Test 4: Admin Features
1. Login as admin
2. Create a new product
3. Upload product images
4. Manage categories
5. View all orders
6. Verify all admin functions work correctly

---

## Need Help?

### Common Issues & Solutions

**Q: How do I make an existing user an admin?**
A: Update the users table:
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'user@example.com';
```

**Q: How do I remove admin privileges?**
A: Update the users table:
```sql
UPDATE public.users 
SET is_admin = false 
WHERE email = 'admin@example.com';
```

**Q: Can I have multiple admin accounts?**
A: Yes! Create additional admin users using the same method.

**Q: What if I forget the admin password?**
A: Use Supabase's password reset feature:
1. Go to Authentication > Users
2. Click on the admin user
3. Click "Reset password" 
4. User will receive password reset email

**Q: How do I disable an admin account?**
A: Set `is_admin = false` in the database, or delete the user from Auth.

---

## File References

- `sql/create-admin-user.sql` - SQL script to create admin
- `src/pages/auth/AdminSignIn.tsx` - Admin login page
- `src/lib/auth.ts` - Authentication service

---

## Next Steps

1. ✅ Create admin user using one of the methods above
2. ✅ Login and verify admin access
3. ✅ Change the default password
4. ✅ Test admin dashboard features
5. ✅ Add more admins if needed
6. ✅ Set up proper security policies

---

**Last Updated**: February 4, 2026
**Version**: 1.0

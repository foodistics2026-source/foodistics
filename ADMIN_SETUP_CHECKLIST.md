# Admin Setup Checklist

## Prerequisites
- [ ] Supabase project created
- [ ] Database connected
- [ ] Users table created

## Setup Steps (In Order)

### 1. Add is_admin Column
- [ ] Open `sql/001-add-is-admin-column.sql`
- [ ] Run in Supabase SQL Editor
- [ ] Verify column added successfully

### 2. Create Auth User
- [ ] Go to Supabase → Authentication → Users
- [ ] Click "+ Add user"
- [ ] Email: `admin@foodistics.com`
- [ ] Password: `Admin@123456` (change to secure password)
- [ ] Click "Create user"
- [ ] **COPY the User ID** (save it temporarily)

### 3. Create Admin Profile in Database
- [ ] Open `sql/create-admin-user.sql`
- [ ] Replace `'YOUR_USER_ID_HERE'` with copied ID
- [ ] Run in Supabase SQL Editor
- [ ] Verify admin user created

### 4. Test Login
- [ ] Open browser: `http://localhost:5173/auth/admin-signin`
- [ ] Email: `admin@foodistics.com`
- [ ] Password: `Admin@123456`
- [ ] Click "Sign In as Admin"
- [ ] Should redirect to `/admin` dashboard
- [ ] Verify you see admin features

## Verify Steps

### Check is_admin Column
```sql
-- Run in SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```
Should show `is_admin | boolean`

### Check Admin User
```sql
-- Run in SQL Editor
SELECT id, email, full_name, is_admin 
FROM public.users 
WHERE email = 'admin@foodistics.com';
```
Should show `is_admin | true`

### Check Auth User
Go to Supabase → Authentication → Users
Should see `admin@foodistics.com` in the list

## Troubleshooting

### Error: column "is_admin" does not exist
- [ ] Run `sql/001-add-is-admin-column.sql` first
- [ ] Wait for migration to complete
- [ ] Then run `sql/create-admin-user.sql`

### Error: User already exists
- [ ] Use different email or delete existing user first
- [ ] Go to Supabase → Auth → Users → Delete user

### Login shows "Access Denied"
- [ ] Verify `is_admin = true` in users table
- [ ] Check user exists in both Auth and users table
- [ ] Verify user ID matches in both places

### Can't access admin dashboard
- [ ] Clear browser cache
- [ ] Try incognito/private window
- [ ] Check console for errors (F12)
- [ ] Verify user is logged in

## File Reference

| File | Purpose | When to Run |
|------|---------|-----------|
| `sql/001-add-is-admin-column.sql` | Add is_admin column | First time setup |
| `sql/create-admin-user.sql` | Create admin user | After Step 1 |

## Credentials

| Item | Value |
|------|-------|
| Email | admin@foodistics.com |
| Password | Admin@123456 |
| Login URL | /auth/admin-signin |
| Dashboard URL | /admin |

## Next Steps

After successful admin setup:
1. [ ] Change admin password
2. [ ] Create additional admins if needed
3. [ ] Set up admin permissions
4. [ ] Configure admin dashboard
5. [ ] Test all admin features

---

**Status**: Ready to follow setup steps!

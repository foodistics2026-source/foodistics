# Quick Admin Setup (2 Minutes)

## Step 0: Add is_admin Column (First Time Only)

1. Go to **Supabase Dashboard → SQL Editor → New Query**
2. Open `sql/001-add-is-admin-column.sql`
3. Copy and paste the SQL
4. Click **Run**

This adds the `is_admin` column to your users table.

---

## Step 1: Create Auth User (Supabase)

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **+ Add user**
3. Enter:
   - **Email**: `admin@foodistics.com`
   - **Password**: `Admin@123456` (change this to something secure)
4. Click **Create user**
5. **COPY the User ID** (you'll need this next)

## Step 2: Create Admin Profile (SQL)

1. Open `sql/create-admin-user.sql`
2. Replace `'YOUR_USER_ID_HERE'` with the ID you copied
3. Go to **Supabase Dashboard → SQL Editor → New Query**
4. Paste the SQL
5. Click **Run**

**Done!** Admin user created in database

---

## Admin Login

### URL
```
http://localhost:5173/auth/admin-signin
```

### Credentials
```
Email: admin@foodistics.com
Password: Admin@123456 (the one you set in Step 1)
```

### After Login
You'll be redirected to `/admin` dashboard

---

## Quick Commands

**View admin users:**
```sql
SELECT id, email, full_name, is_admin FROM public.users WHERE is_admin = true;
```

**Make user admin:**
```sql
UPDATE public.users SET is_admin = true WHERE email = 'user@example.com';
```

**Remove admin privileges:**
```sql
UPDATE public.users SET is_admin = false WHERE email = 'admin@example.com';
```

---

## File Locations

| File | Purpose |
|------|---------|
| `sql/create-admin-user.sql` | SQL to create admin user |
| `src/pages/auth/AdminSignIn.tsx` | Admin login page |
| `src/lib/auth.ts` | Auth service |

---

## Troubleshooting

**Admin login shows "Access Denied"?**
- Make sure `is_admin = true` in users table
- Verify user exists in both Auth and users table

**Need to reset admin password?**
- Supabase Dashboard → Auth → Users → Click user → Reset password

**Want to add more admins?**
```sql
UPDATE public.users SET is_admin = true WHERE email = 'user@example.com';
```

---

**Need detailed help?** See `ADMIN_SETUP_GUIDE.md`

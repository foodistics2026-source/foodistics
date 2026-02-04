# Complete Foodistics Setup & Troubleshooting Guide

## Quick Start - Fix All RLS Issues

### Run These SQL Scripts in Order (In Supabase SQL Editor)

#### Script 1: Fix Users & Carts RLS (⚠️ CRITICAL FOR SIGNUP)
```sql
-- Copy from: sql/fix-users-table-rls.sql
-- This fixes the "42501 RLS violation" error on signup
```

#### Script 2: Fix Categories & Products RLS
```sql
-- Copy from: sql/fix-rls-policies.sql
-- This fixes the "42501 RLS violation" error on category/product creation
```

#### Script 3: Create Storage Bucket & Policies
```sql
-- Copy from: sql/create-storage-bucket.sql
-- This fixes the "bucket not found" error on image upload
```

---

## Step-by-Step Setup

### Phase 1: Database Configuration (MUST DO FIRST)

#### Step 1.1: Fix Users Table RLS
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open `sql/fix-users-table-rls.sql` from your project
4. Copy entire content
5. Paste into SQL Editor
6. Click **Run**
7. Expected: No errors, policies created ✅

**What this does:**
- Allows users to create their own profile during signup
- Allows users to view and update their own profile
- Allows users to create and manage their own cart

#### Step 1.2: Fix Categories & Products RLS
1. Create new SQL query
2. Open `sql/fix-rls-policies.sql` from your project
3. Copy entire content
4. Paste into SQL Editor
5. Click **Run**
6. Expected: No errors, policies created ✅

**What this does:**
- Allows authenticated users to view all categories
- Allows authenticated users to create, edit, delete categories
- Allows authenticated users to view all products
- Allows authenticated users to create, edit, delete products
- Allows public users to view categories and products

### Phase 2: Storage Configuration

#### Step 2.1: Create Storage Bucket
1. Go to **Storage** in left sidebar
2. Click **+ New Bucket**
3. Enter: `product-images` (exact spelling)
4. Select: **Public** visibility
5. Click **Create Bucket**

#### Step 2.2: Create Storage Policies
1. Go to **SQL Editor**
2. Open `sql/create-storage-bucket.sql` from your project
3. Copy entire content
4. Paste into SQL Editor
5. Click **Run**
6. Expected: No errors, policies created ✅

**What this does:**
- Allows authenticated users to upload images
- Allows authenticated users to update/delete their images
- Allows public users to view all images

### Phase 3: Application Testing

#### Test 3.1: User Signup
1. Start your app: `npm run dev`
2. Go to http://localhost:5173/auth/signup
3. Fill in form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: Password123!
   - Confirm: Password123!
4. Click **Create Account**
5. Expected: "Account created successfully!" ✅
6. Should redirect to signin page

**If error:**
- Check browser console (F12 → Console tab)
- Look for error messages
- Verify `sql/fix-users-table-rls.sql` was run

#### Test 3.2: User Signin
1. Go to http://localhost:5173/auth/signin
2. Enter the email and password from signup
3. Click **Sign In**
4. Expected: Redirected to home page ✅
5. Navbar should show "Account" dropdown

**If error:**
- Check credentials are correct
- Hard refresh: Ctrl+Shift+R
- Clear browser cache

#### Test 3.3: Admin Login (Optional)
1. Go to http://localhost:5173/auth/admin-signin
2. Try with regular user account
3. Expected: "Access Denied" message ✅
4. This is correct - only admins can access

**To create admin:**
- Go to Supabase → Authentication → Users
- Find your user
- Run SQL: `UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';`

#### Test 3.4: Create Category
1. Sign in as admin
2. Go to http://localhost:5173/admin
3. Click **Categories** tab
4. Click **Add Category**
5. Enter: "Black Tea"
6. Click **Create Category**
7. Expected: "Category created successfully!" ✅
8. Category appears in list

**If error:**
- Check if you're logged in as admin
- Verify `sql/fix-rls-policies.sql` was run
- Check browser console for error details

#### Test 3.5: Create Product
1. Click **Products** tab
2. Click **Add Product**
3. Fill form:
   - Name: Assam Black Tea
   - Category: Black Tea (select from dropdown)
   - Description: Premium Assam tea
   - Price: 299
   - Sale Price: (leave empty)
   - Image: Upload a tea image
   - Stock: 50
4. Click **Create Product**
5. Expected: "Product created successfully!" ✅

**If image upload fails:**
- Check error message
- Verify `product-images` bucket exists and is Public
- Verify `sql/create-storage-bucket.sql` was run
- Hard refresh app: Ctrl+Shift+R

#### Test 3.6: View Products on Shop
1. Go to http://localhost:5173/shop
2. Should see "Our Tea Collection" heading
3. Should see "Black Tea" category section
4. Should see "Assam Black Tea" product card
5. Click on product to view details
6. Expected: Product detail page loads ✅

#### Test 3.7: Mobile Responsiveness
1. Open DevTools: F12
2. Click **Toggle Device Toolbar**: Ctrl+Shift+M
3. Select iPhone SE (375x667)
4. Try all actions:
   - Navigate pages
   - Open dialogs
   - Scroll forms
5. Expected: Everything fits and works ✅

---

## Troubleshooting Matrix

| Error | Cause | Solution |
|-------|-------|----------|
| `42501 RLS violation on users` | Users table RLS policies missing | Run `sql/fix-users-table-rls.sql` |
| `42501 RLS violation on categories` | Categories RLS policies missing | Run `sql/fix-rls-policies.sql` |
| `42501 RLS violation on products` | Products RLS policies missing | Run `sql/fix-rls-policies.sql` |
| `bucket not found` on image upload | Storage bucket doesn't exist | Create `product-images` bucket via UI |
| Signup fails silently | Network or auth error | Check browser console (F12) |
| Can't upload image | Storage policies missing | Run `sql/create-storage-bucket.sql` |
| Product form goes off-screen | CSS not applied | Hard refresh: Ctrl+Shift+R |
| Scrollbar visible in dialogs | tailwind-scrollbar-hide not installed | Run `npm install tailwind-scrollbar-hide` |

---

## File Reference

| File | Purpose | Status |
|------|---------|--------|
| `sql/fix-users-table-rls.sql` | Users & Carts RLS policies | ⏳ Run first |
| `sql/fix-rls-policies.sql` | Categories & Products RLS | ⏳ Run second |
| `sql/create-storage-bucket.sql` | Storage bucket policies | ⏳ Run third |
| `src/lib/auth.ts` | Authentication service | ✅ Updated with error logging |
| `src/pages/auth/SignUp.tsx` | Signup page | ✅ Updated with error logging |
| `src/components/ProductCarousel.tsx` | Product display | ✅ Styled |
| `src/pages/Shop.tsx` | Shop page | ✅ Styled |

---

## Complete Setup Checklist

- [ ] Phase 1.1: Run `sql/fix-users-table-rls.sql`
- [ ] Phase 1.2: Run `sql/fix-rls-policies.sql`
- [ ] Phase 2.1: Create `product-images` bucket (Public)
- [ ] Phase 2.2: Run `sql/create-storage-bucket.sql`
- [ ] Test 3.1: User signup works ✅
- [ ] Test 3.2: User signin works ✅
- [ ] Test 3.3: Admin access denied for regular users ✅
- [ ] Test 3.4: Category creation works ✅
- [ ] Test 3.5: Product creation works ✅
- [ ] Test 3.6: Products display on shop ✅
- [ ] Test 3.7: Mobile responsive ✅

---

## Common Issues & Fixes

### Issue: "Account created successfully!" but still can't sign in
**Fix:** Wait 5 seconds, then try signing in. Supabase Auth can have slight delays.

### Issue: Admin signin shows "Access Denied"
**Fix:** This is expected for non-admin users. Run this SQL to make user admin:
```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

### Issue: Image upload shows "bucket not found"
**Fix:** 
1. Verify bucket name is exactly `product-images` (lowercase, no spaces)
2. Verify bucket visibility is set to "Public"
3. Run `sql/create-storage-bucket.sql` for storage policies

### Issue: Form scrollbar visible in admin dialog
**Fix:** Hard refresh browser: Ctrl+Shift+R

### Issue: Product carousel buttons not visible
**Fix:** Hard refresh: Ctrl+Shift+R, hover over product cards to reveal buttons

---

## Environment Variables Needed

Make sure `.env.local` (or `.env`) has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from Supabase → Project Settings → API

---

## Support Commands

### Check RLS Policies
```sql
-- View all RLS policies
SELECT tablename, policyname FROM pg_policies ORDER BY tablename;

-- View users table policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- View categories table policies
SELECT * FROM pg_policies WHERE tablename = 'categories';
```

### Check Storage
```sql
-- View all buckets
SELECT id, name, public FROM storage.buckets;

-- View storage policies
SELECT * FROM pg_policies WHERE schemaname = 'storage';
```

### Clear All Policies (⚠️ WARNING - Resets Access!)
```sql
-- ONLY RUN IF YOU WANT TO RESET EVERYTHING
DROP POLICY IF EXISTS "Allow service role to insert user profiles" ON users CASCADE;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories CASCADE;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products CASCADE;
-- Then re-run the fix SQL files
```

---

## Success Indicators

✅ Users can sign up without errors  
✅ Users can sign in with correct credentials  
✅ Users see "Account" menu in navbar when signed in  
✅ Admins can access `/admin` page  
✅ Admins can create, edit, delete categories  
✅ Admins can create, edit, delete products  
✅ Admins can upload product images  
✅ Products display on `/shop` page  
✅ All pages responsive on mobile  
✅ No scrollbars visible in admin dialogs  

---

## Next Steps After Setup Complete

1. Create sample data:
   - 3-4 tea categories (Black, Green, Herbal, Specialty)
   - 2-3 products per category with descriptions and images

2. Test customer features:
   - Browse shop
   - View product details
   - Add to cart
   - View cart
   - Checkout

3. Deploy to production:
   - Build app: `npm run build`
   - Deploy to Vercel/Netlify
   - Update Supabase Auth redirect URLs

---

Last Updated: February 4, 2026

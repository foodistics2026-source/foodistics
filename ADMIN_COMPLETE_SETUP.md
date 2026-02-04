# Foodistics Admin Setup Checklist

## Database & Security Setup

### Step 1: Create Storage Bucket ⚠️ REQUIRED
- [ ] Go to Supabase Dashboard
- [ ] Click **Storage** in left sidebar
- [ ] Click **+ New Bucket**
- [ ] Name: `product-images` (exact spelling, lowercase, with hyphen)
- [ ] Visibility: **Public**
- [ ] Click **Create Bucket**

**Reference:** See `STORAGE_BUCKET_SETUP.md`

### Step 2: Create Storage Policies
- [ ] Click on `product-images` bucket
- [ ] Go to **Policies** tab
- [ ] Run the SQL from `sql/create-storage-bucket.sql` in SQL Editor
- [ ] OR manually create policies using UI

**Reference:** See `STORAGE_BUCKET_SETUP.md` - Option B for UI instructions

### Step 3: Fix RLS Policies ⚠️ CRITICAL
- [ ] Go to **SQL Editor**
- [ ] Copy entire content from `sql/fix-rls-policies.sql`
- [ ] Paste into SQL Editor
- [ ] Click **Run**

This enables:
- ✅ Categories table CRUD operations
- ✅ Products table CRUD operations
- ✅ Public read access (for customer pages)

**Reference:** See `RLS_FIX_GUIDE.md`

### Step 4: Create Admin User (Optional)
- [ ] Go to **Authentication** in Supabase
- [ ] Click **Users**
- [ ] Click **Invite User** or use SQL script
- [ ] Email: `admin@foodistics.com` (or your email)
- [ ] Password: `GeneratePassword123!`
- [ ] Copy the User ID
- [ ] Go to **SQL Editor**
- [ ] Run: `UPDATE auth.users SET is_admin = true WHERE id = 'USER_ID_HERE';`

## Application Testing

### Step 5: Test Category Creation
- [ ] Go to `http://localhost:5173/admin`
- [ ] Click **Categories** tab
- [ ] Click **Add Category**
- [ ] Enter name: "Black Tea"
- [ ] Click **Create Category**
- [ ] Expected: "Category created successfully" ✅

### Step 6: Test Product Creation
- [ ] Click **Products** tab
- [ ] Click **Add Product**
- [ ] Fill form:
  - **Name:** Assam Black Tea
  - **Category:** Black Tea
  - **Description:** Premium black tea
  - **Price:** 299
  - **Sale Price:** (leave empty)
  - **Image:** Upload a tea image
  - **Stock:** 10
- [ ] Click **Create Product**
- [ ] Expected: "Product created successfully" ✅

### Step 7: Test Product Image Upload
- [ ] During product creation, click image upload area
- [ ] Select an image (JPEG, PNG, WebP, GIF - max 5MB)
- [ ] Expected: Image preview shows
- [ ] Expected: Upload completes with "Image uploaded successfully" ✅

### Step 8: Test Product Edit/Delete
- [ ] Click **Products** tab
- [ ] Expand a category
- [ ] Click **Edit** on a product
- [ ] Modify name or price
- [ ] Click **Update Product**
- [ ] Expected: "Product updated successfully" ✅
- [ ] Click **Delete** on a product
- [ ] Click **Continue** in confirmation
- [ ] Expected: "Product deleted successfully" ✅

### Step 9: Test Category Edit/Delete
- [ ] Click **Categories** tab
- [ ] Click **Edit** on a category
- [ ] Change name
- [ ] Click **Update Category**
- [ ] Expected: "Category updated successfully" ✅
- [ ] Click **Delete** on a category
- [ ] Click **Continue** in confirmation
- [ ] Expected: "Category deleted successfully" ✅

### Step 10: Test on Mobile (Responsive)
- [ ] Open DevTools (F12)
- [ ] Click **Toggle Device Toolbar** (Ctrl+Shift+M)
- [ ] Set viewport to 375x667 (iPhone SE)
- [ ] Click **Add Product** button
- [ ] Expected: Form dialog fits on mobile screen
- [ ] Expected: No scrollbar visible (but scrollable)
- [ ] Expected: All fields visible and properly aligned
- [ ] Expected: Create button visible at bottom ✅

## Troubleshooting

### Image Upload Fails: "bucket not found"
- [ ] Verify bucket name is exactly `product-images` (lowercase)
- [ ] Check Storage → Buckets in Supabase
- [ ] Verify bucket is Public
- [ ] Hard refresh app: Ctrl+Shift+R

### Category/Product Creation Fails: "42501 RLS violation"
- [ ] Check `sql/fix-rls-policies.sql` was run
- [ ] Go to Database → categories/products table
- [ ] Click RLS button
- [ ] Verify policies exist:
  - "Allow authenticated users to select categories"
  - "Allow authenticated users to insert categories"
  - "Allow authenticated users to update categories"
  - "Allow authenticated users to delete categories"
- [ ] Same for products table

### Form Doesn't Fit on Mobile
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check that `tailwind-scrollbar-hide` was installed
- [ ] Check ProductForm has `scrollbar-hide` class
- [ ] Check Admin.tsx dialog has `flex flex-col` with scrollable wrapper

## Files Reference

| File | Purpose |
|------|---------|
| `RLS_FIX_GUIDE.md` | Guide to fix RLS policy errors |
| `STORAGE_BUCKET_SETUP.md` | Guide to create storage bucket |
| `sql/fix-rls-policies.sql` | SQL to fix categories & products RLS |
| `sql/create-storage-bucket.sql` | SQL to create storage policies |
| `src/components/admin/CategoryForm.tsx` | Category create/edit form |
| `src/components/admin/ProductForm.tsx` | Product create/edit form |
| `src/components/ImageUpload.tsx` | Image upload component |
| `src/lib/imageUpload.ts` | Image upload utility |
| `src/hooks/useProducts.ts` | React Query hooks for DB operations |

## Status

**Setup Completion:** [ ]/10 steps

- [ ] Step 1: Storage Bucket Created
- [ ] Step 2: Storage Policies Set
- [ ] Step 3: RLS Policies Fixed
- [ ] Step 4: Admin User Created
- [ ] Step 5: Category Creation Works
- [ ] Step 6: Product Creation Works
- [ ] Step 7: Image Upload Works
- [ ] Step 8: Edit/Delete Works
- [ ] Step 9: Category Mgmt Works
- [ ] Step 10: Mobile Responsive Works

Once all steps are complete, your admin dashboard is ready! 🎉

# Foodistics E-Commerce Quick Start Guide

## What's New?

Your Foodistics website now has e-commerce functionality with:

### ✅ New Pages
- **`/shop`** - Product shop with category carousels
- **`/admin`** - Admin dashboard to manage products and categories

### ✅ New Features
- Product management (Create, Read, Update, Delete)
- Category management
- Product carousel displays per category
- Sale prices with visual indicators
- Stock tracking
- Responsive design

## Quick Setup (5 minutes)

### Step 1: Get Supabase Credentials
1. Visit [supabase.com](https://supabase.com)
2. Sign up (free) and create a new project
3. Go to **Project Settings → API**
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon Key → `VITE_SUPABASE_ANON_KEY`

### Step 2: Update Environment Variables
Open `.env.local` in your project root:
```
VITE_SUPABASE_URL=your_actual_project_url
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

### Step 3: Create Database Tables
Go to Supabase Dashboard → **SQL Editor** and paste this:

```sql
-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);

-- Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_prices CHECK (sale_price IS NULL OR sale_price < price)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');
```

### Step 4: Start Your App
```bash
npm run dev
```

Visit:
- **Home**: http://localhost:5173/
- **Shop**: http://localhost:5173/shop
- **Admin**: http://localhost:5173/admin

## How to Use

### Admin Dashboard

#### Add Category
1. Go to `/admin`
2. Click **"Add Category"** button
3. Fill in: Name, Description (optional), Image URL (optional)
4. Click **"Create Category"**

#### Add Product
1. Go to `/admin` → **Products** tab
2. Click **"Add Product"** button
3. Fill in:
   - **Product Name**: e.g., "Premium Assam Black Tea"
   - **Category**: Select from dropdown
   - **Description**: Product details
   - **Price**: Base price (₹)
   - **Sale Price**: Optional - if set, product shows "Sale" badge
   - **Image URL**: Direct link to product image
   - **Stock**: Number of items available
4. Click **"Create Product"**

#### Edit/Delete Product
- **Edit**: Click pencil icon in Products table
- **Delete**: Click trash icon (confirms before deleting)

### Shop Page (`/shop`)

- Products are automatically grouped by category
- Each category has a **horizontal scrollable carousel**
- Navigation arrows appear if there are more than 3 products
- Products show:
  - Image
  - Name
  - Description
  - Price (with strikethrough if on sale)
  - Sale price (in gold if available)
  - Stock status
  - "Add to Cart" button (ready for future implementation)

## File Structure

```
src/
├── pages/
│   ├── Admin.tsx          # Admin dashboard
│   └── Shop.tsx           # Shop page with carousels
├── components/
│   ├── ProductCarousel.tsx # Carousel component
│   ├── admin/
│   │   ├── ProductForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── ProductsTable.tsx
│   │   └── CategoriesTable.tsx
│   └── layout/
│       └── Navbar.tsx     # Updated with Shop & Admin links
├── hooks/
│   └── useProducts.ts     # All React Query hooks
└── lib/
    └── supabase.ts        # Supabase client & types
```

## Product Data Fields

### Category
| Field | Type | Required |
|-------|------|----------|
| name | string | ✓ |
| description | text | - |
| image_url | string | - |

### Product
| Field | Type | Required |
|-------|------|----------|
| name | string | ✓ |
| category_id | UUID | ✓ |
| description | text | - |
| price | decimal | ✓ |
| sale_price | decimal | - |
| image_url | string | ✓ |
| stock | integer | ✓ |

## Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Tea-gold color** (`#D4A574`) for accents
- **Responsive design** (mobile-first)

## Next Steps

1. ✅ Add categories via admin
2. ✅ Add products via admin
3. 🔄 Implement "Add to Cart" functionality
4. 🔄 Create shopping cart page
5. 🔄 Add checkout with payment (Stripe, Razorpay, etc.)
6. 🔄 Implement user authentication
7. 🔄 Add product search & filters
8. 🔄 Create order history page

## Sample Products for Testing

### Category: Assam Black Tea
- Name: Premium Assam Black Tea
- Price: ₹450
- Sale Price: ₹399
- Stock: 50

### Category: Green Tea
- Name: Pure Green Tea
- Price: ₹350
- Sale Price: ₹299
- Stock: 40

### Category: Herbal Tea
- Name: Organic Herbal Blend
- Price: ₹300
- Sale Price: (no sale)
- Stock: 35

## Troubleshooting

**Products not showing?**
- Make sure categories exist first
- Check environment variables are correct
- Check browser console for errors

**"Add to Cart" button doesn't work?**
- This is a placeholder button ready for implementation
- Connect it to your cart state management

**Getting Supabase errors?**
- Verify API credentials in `.env.local`
- Ensure tables are created in database
- Check row-level security policies are enabled

## Support Files

- **ECOMMERCE_SETUP.md** - Detailed setup guide with SQL scripts
- **.env.local** - Environment variables (add your credentials here)
- **.env.example** - Template for environment variables

---

**Questions?** Check the detailed ECOMMERCE_SETUP.md file for more information!

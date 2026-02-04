# E-Commerce Setup Guide

This guide will help you set up the e-commerce functionality for Foodistics tea leaves.

## Prerequisites

- Node.js and npm/yarn/pnpm installed
- Supabase account (free at https://supabase.com)

## Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

The following packages have been added:
- `@supabase/supabase-js` - Supabase client library
- `zod` - Schema validation

## Step 2: Set Up Supabase Project

1. Go to https://supabase.com and create a new project
2. Once created, go to Project Settings → API
3. Copy your:
   - Project URL (VITE_SUPABASE_URL)
   - Anon Key (VITE_SUPABASE_ANON_KEY)

## Step 3: Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Replace with your actual Supabase credentials.

## Step 4: Create Database Tables in Supabase

Go to Supabase Dashboard → SQL Editor and run the following SQL:

### Create Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);
```

### Create Products Table

```sql
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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

## Step 5: Run Your Application

```bash
npm run dev
```

## Available Routes

- **`/`** - Home page with hero section
- **`/shop`** - Shop page with products organized by category in carousels
- **`/admin`** - Admin dashboard to manage products and categories

## Admin Dashboard Features

### Products Tab
- **View all products** in a table format
- **Add new product** - Click "Add Product" button
- **Edit product** - Click the pencil icon
- **Delete product** - Click the trash icon
- **Fields available:**
  - Product Name
  - Category (dropdown)
  - Description
  - Price
  - Sale Price (optional)
  - Image URL
  - Stock Quantity

### Categories Tab
- **View all categories** in a table format
- **Add new category** - Click "Add Category" button
- **Fields available:**
  - Category Name
  - Description
  - Image URL

## Sample Data

You can manually add sample data through the admin dashboard or use Supabase's Data Editor:

### Categories
1. Assam Black Tea
2. Green Tea
3. Herbal Tea
4. Masala Chai
5. Premium Gold Blend

### Products (Example)
```
Category: Assam Black Tea
- Name: Premium Assam Black Tea
- Price: ₹450
- Sale Price: ₹399
- Image URL: https://example.com/tea-assam.jpg
- Stock: 50
```

## Component Structure

### New Components Created

- **`ProductCarousel.tsx`** - Displays products in a horizontal scrollable carousel per category
- **`Admin.tsx`** - Main admin dashboard page
- **`ProductForm.tsx`** - Form for adding/editing products
- **`CategoryForm.tsx`** - Form for adding categories
- **`ProductsTable.tsx`** - Table view of all products with edit/delete actions
- **`CategoriesTable.tsx`** - Table view of all categories

### Hooks

- **`useProducts.ts`** - React Query hooks for all product and category operations:
  - `useCategories()` - Fetch all categories
  - `useProducts(categoryId?)` - Fetch products (optional filter by category)
  - `useProductById(id)` - Fetch single product
  - `useCreateProduct()` - Create new product
  - `useUpdateProduct()` - Update product
  - `useDeleteProduct()` - Delete product
  - `useCreateCategory()` - Create new category

### Services

- **`supabase.ts`** - Supabase client initialization and type definitions

## Customization

### Styling
- Colors are using Tailwind CSS with custom `tea-gold` color
- All components use shadcn/ui components for consistency

### Add to Cart
The "Add to Cart" button in the ProductCarousel is ready for implementation. Connect it to your cart state management solution (Zustand, Redux, Context API, etc.)

### Authentication
To restrict admin access, add authentication check in the `Admin.tsx` page using Supabase auth.

## Troubleshooting

### "Cannot find module @supabase/supabase-js"
Make sure you've run `npm install` after updating package.json.

### Environment variables not loading
Make sure your `.env.local` file is in the root directory and restart the dev server.

### No products showing on /shop
1. Check that you've created categories in Supabase
2. Check that you've created products linked to those categories
3. Check browser console for any errors
4. Verify Supabase credentials are correct

## Next Steps

1. Add authentication for admin panel
2. Implement shopping cart functionality
3. Add checkout page with payment integration
4. Create user account/order history pages
5. Add product reviews and ratings
6. Implement product search and filters

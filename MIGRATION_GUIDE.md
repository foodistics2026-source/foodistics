# Supabase Database Migration Guide

## Overview

This guide provides detailed instructions for setting up your Foodistics e-commerce database on Supabase.

## Files Included

- **`001_initial_schema.sql`** - Complete database schema migration with sample data

## Quick Setup (2 steps)

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **+ New Query**

### Step 2: Run the Migration
1. Copy all content from `migrations/001_initial_schema.sql`
2. Paste into the SQL editor
3. Click **Run** (or press Ctrl+Enter)

Done! Your database is now set up ✅

---

## What Gets Created

### Tables

#### 1. **categories**
Stores product categories (Assam Black Tea, Green Tea, etc.)
```
Columns: id, name, description, image_url, created_at, updated_at
```

#### 2. **products**
Stores individual tea products with pricing and inventory
```
Columns: id, category_id, name, description, price, sale_price, 
         image_url, stock, sku, created_at, updated_at
```

#### 3. **users** (for future auth)
Stores customer profiles linked to Supabase Auth
```
Columns: id, email, full_name, phone, avatar_url, created_at, updated_at
```

#### 4. **orders** (for future checkout)
Stores customer orders
```
Columns: id, user_id, order_number, status, total_amount, tax_amount,
         shipping_amount, customer_email, customer_phone, shipping_address,
         notes, created_at, updated_at
```

#### 5. **order_items**
Line items within orders
```
Columns: id, order_id, product_id, quantity, price_at_purchase,
         sale_price_at_purchase, created_at
```

#### 6. **reviews** (for product ratings)
Customer reviews and ratings for products
```
Columns: id, product_id, user_id, rating, title, comment, helpful_count,
         created_at, updated_at
```

#### 7. **carts** (for persistent shopping carts)
User shopping carts
```
Columns: id, user_id, created_at, updated_at
```

#### 8. **cart_items**
Items in shopping carts
```
Columns: id, cart_id, product_id, quantity, created_at, updated_at
```

### Indexes Created

All tables have indexes on commonly queried fields for optimal performance:
- Category name and creation date
- Product category, name, creation, and stock
- Order user, number, status, and date
- And more...

### Constraints

- **Price validation**: `sale_price` must be less than `price`
- **Stock validation**: Stock cannot be negative
- **Unique constraints**: Category names and SKUs are unique
- **Foreign keys**: Proper relationships between tables with cascade deletes

### Security (Row Level Security - RLS)

All tables have RLS enabled with policies for:
- **Public read-only**: Categories and products can be read by anyone
- **User-scoped access**: Users can only see their own orders and carts
- **Admin access**: Admins can manage all data (using JWT role)

### Automatic Timestamps

`updated_at` columns automatically update whenever a record is modified using database triggers.

### Views Created

#### 1. **products_availability**
Shows product availability status and sale information
```sql
SELECT * FROM products_availability;
```
Returns:
- Product details
- Category name
- Stock status: "In Stock", "Low Stock", or "Out of Stock"
- Whether product is on sale

#### 2. **category_product_counts**
Shows number of products per category
```sql
SELECT * FROM category_product_counts;
```
Returns:
- Category details
- Total product count
- Available (in-stock) product count

---

## Sample Data

The migration automatically inserts:

### 5 Sample Categories
1. Assam Black Tea
2. Green Tea
3. Herbal Tea
4. Masala Chai
5. Premium Gold Blend

### 5 Sample Products
```
| Category | Product Name | Price | Sale Price | Stock |
|----------|--------------|-------|------------|-------|
| Assam | Premium Assam Black Tea | ₹450 | ₹399 | 50 |
| Green | Pure Green Tea | ₹350 | ₹299 | 40 |
| Herbal | Organic Herbal Blend | ₹300 | - | 35 |
| Masala | Traditional Masala Chai | ₹280 | ₹239 | 60 |
| Gold | Golden Reserve Tea | ₹650 | ₹599 | 25 |
```

To skip sample data, comment out STEP 14 in the SQL file.

---

## Understanding Row Level Security (RLS)

### Public Policies
```sql
-- Anyone can read products and categories
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

### User-Scoped Policies
```sql
-- Users can only see their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

### Admin Policies
```sql
-- Admins can manage everything
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## How to Query Data

### From Your React App

```typescript
// Get all categories
const { data: categories } = await supabase
  .from('categories')
  .select('*');

// Get products by category
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId);

// Get product availability view
const { data: availability } = await supabase
  .from('products_availability')
  .select('*')
  .eq('category_name', 'Assam Black Tea');
```

### Directly in Supabase

```sql
-- View all products with their categories
SELECT 
  p.name,
  c.name as category,
  p.price,
  p.sale_price,
  p.stock
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY c.name, p.name;

-- Check product availability
SELECT * FROM products_availability;

-- Count products per category
SELECT * FROM category_product_counts;
```

---

## Management

### Add New Category
```sql
INSERT INTO categories (name, description, image_url) 
VALUES ('Oolong Tea', 'Semi-oxidized traditional oolong', 'https://...');
```

### Add New Product
```sql
INSERT INTO products (
  category_id, 
  name, 
  description, 
  price, 
  sale_price, 
  image_url, 
  stock, 
  sku
) VALUES (
  (SELECT id FROM categories WHERE name = 'Oolong Tea'),
  'Premium Oolong',
  'High quality oolong tea',
  500.00,
  449.00,
  'https://...',
  30,
  'OOLONG-001'
);
```

### Update Product Stock
```sql
UPDATE products 
SET stock = stock - 5 
WHERE id = 'product-id';
```

### Put Product on Sale
```sql
UPDATE products 
SET sale_price = 399.00 
WHERE name = 'Premium Assam Black Tea';
```

### Remove from Sale
```sql
UPDATE products 
SET sale_price = NULL 
WHERE id = 'product-id';
```

---

## Future Functionality

The schema includes tables for features you can implement later:

### 1. User Authentication
- Uses Supabase Auth automatically
- `users` table extends auth with additional fields

### 2. Shopping Cart
- Persistent carts stored in `carts` and `cart_items`
- Each user has one cart with multiple items

### 3. Orders & Checkout
- `orders` table tracks customer orders
- `order_items` tracks what was in each order
- Order history available per user

### 4. Product Reviews
- `reviews` table for customer ratings
- Link reviews to products and users
- Track helpful votes

---

## Backup & Recovery

### Export Data
In Supabase Dashboard:
1. Go to **Project Settings**
2. Click **Database**
3. Click **Backups**
4. Click **Request a backup**

### Restore Specific Table
```bash
# Export a table as CSV
# In Supabase: Click table → Download as CSV

# Or use SQL to export
COPY (SELECT * FROM products) TO STDOUT WITH CSV HEADER;
```

---

## Performance Optimization

The migration includes:
- ✅ Indexes on frequently searched fields
- ✅ Foreign key constraints for data integrity
- ✅ Row-level security for data isolation
- ✅ Views for complex queries
- ✅ Trigger functions for automatic updates

### Monitor Query Performance
In Supabase Dashboard:
1. Go to **Logs** → **Postgres Logs**
2. Look for slow queries (> 100ms)
3. Add indexes if needed

---

## Troubleshooting

### Error: "Table already exists"
This is fine - the `IF NOT EXISTS` clause prevents errors. Just run it again.

### Error: "Permission denied"
Make sure you're logged in with an authenticated Supabase account.

### No sample data appearing?
Check STEP 14 in the SQL file. Make sure you didn't comment it out.

### RLS blocking queries?
Create appropriate policies (see the migration file for examples).

---

## Useful SQL Queries

### Get sales summary
```sql
SELECT 
  c.name as category,
  COUNT(p.id) as total_products,
  COUNT(CASE WHEN p.sale_price IS NOT NULL THEN 1 END) as on_sale,
  SUM(p.stock) as total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name;
```

### Find low stock products
```sql
SELECT * FROM products 
WHERE stock < 10 
AND stock > 0
ORDER BY stock;
```

### Get best selling products (if orders data exists)
```sql
SELECT 
  p.name,
  SUM(oi.quantity) as total_sold,
  p.category_id
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category_id
ORDER BY total_sold DESC;
```

### Calculate average review rating
```sql
SELECT 
  p.name,
  ROUND(AVG(r.rating), 2) as avg_rating,
  COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC;
```

---

## Next Steps

1. ✅ Run this migration
2. 🔄 Connect your React app to these tables
3. 🔄 Set up authentication for user accounts
4. 🔄 Implement shopping cart functionality
5. 🔄 Add checkout and payment processing
6. 🔄 Enable product reviews

---

## Support

For issues with Supabase:
- Documentation: https://supabase.com/docs
- Status Page: https://status.supabase.com
- Community: https://discord.supabase.io

For issues with the schema:
- Check the ECOMMERCE_SETUP.md file
- Review QUICK_START.md guide
- Check src/hooks/useProducts.ts for query examples

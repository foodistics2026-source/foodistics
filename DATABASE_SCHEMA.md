# Database Schema Diagram & Documentation

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Database Schema                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      categories          │
├──────────────────────────┤
│ id (UUID) [PK]          │
│ name (VARCHAR) [UNIQUE] │
│ description (TEXT)      │
│ image_url (TEXT)        │
│ created_at (TIMESTAMP)  │
│ updated_at (TIMESTAMP)  │
└──────────┬───────────────┘
           │ 1
           │
           │ Many
           ▼
┌──────────────────────────────────────────┐
│         products                         │
├──────────────────────────────────────────┤
│ id (UUID) [PK]                          │
│ category_id (UUID) [FK] ───────────────►│
│ name (VARCHAR)                          │
│ description (TEXT)                      │
│ price (DECIMAL)                         │
│ sale_price (DECIMAL) [NULLABLE]         │
│ image_url (TEXT)                        │
│ stock (INTEGER)                         │
│ sku (VARCHAR) [UNIQUE]                  │
│ created_at (TIMESTAMP)                  │
│ updated_at (TIMESTAMP)                  │
└──────────┬────────────────┬──────────────┘
           │                │
           │ 1              │ 1
           │                │
       Many│            Many│
    ┌──────▼──────────┐ ┌───▼─────────────────────┐
    │ order_items     │ │ reviews                 │
    ├─────────────────┤ ├─────────────────────────┤
    │ id (UUID) [PK]  │ │ id (UUID) [PK]         │
    │ order_id [FK]  │ │ product_id [FK] ──┐    │
    │ product_id [FK]►│ │ user_id [FK]      │    │
    │ quantity        │ │ rating            │    │
    │ price_at_purch. │ │ title             │    │
    │ sale_price_atP. │ │ comment           │    │
    │ created_at      │ │ helpful_count     │    │
    └─────────────────┘ │ created_at        │    │
           ▲            │ updated_at        │    │
           │            └─────────────────────────┘
           │
       Many│
           │ 1
    ┌──────┴──────────────────┐
    │       orders            │
    ├─────────────────────────┤
    │ id (UUID) [PK]         │
    │ user_id (UUID) [FK]    │
    │ order_number [UNIQUE]  │
    │ status (VARCHAR)       │
    │ total_amount (DECIMAL) │
    │ tax_amount (DECIMAL)   │
    │ shipping_amount        │
    │ customer_email         │
    │ customer_phone         │
    │ shipping_address       │
    │ notes (TEXT)           │
    │ created_at (TIMESTAMP) │
    │ updated_at (TIMESTAMP) │
    └──────────┬──────────────┘
               │ 1
               │
           Many│
    ┌──────────▼──────────┐
    │      users          │
    ├─────────────────────┤
    │ id (UUID) [PK]     │
    │ email [UNIQUE]     │
    │ full_name          │
    │ phone              │
    │ avatar_url         │
    │ created_at         │
    │ updated_at         │
    └────────┬────────────┘
             │ 1
             │
         Many│
    ┌────────▼──────────────────┐
    │       carts               │
    ├───────────────────────────┤
    │ id (UUID) [PK]           │
    │ user_id (UUID) [FK,UNIQ] │
    │ created_at (TIMESTAMP)   │
    │ updated_at (TIMESTAMP)   │
    └────────┬──────────────────┘
             │ 1
             │
         Many│
    ┌────────▼──────────────────────┐
    │      cart_items               │
    ├───────────────────────────────┤
    │ id (UUID) [PK]               │
    │ cart_id (UUID) [FK]         │
    │ product_id (UUID) [FK]      │
    │ quantity (INTEGER)          │
    │ created_at (TIMESTAMP)      │
    │ updated_at (TIMESTAMP)      │
    └───────────────────────────────┘
```

## Table Descriptions

### 1. **categories** - Product Categories
Stores the main product categories for organizing teas.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Category name (e.g., "Assam Black Tea") |
| description | TEXT | - | Category description |
| image_url | TEXT | - | Category image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- idx_categories_name (on name)
- idx_categories_created_at (on created_at)

**RLS Policies:**
- ✅ Public SELECT
- ✅ Admin INSERT, UPDATE, DELETE

---

### 2. **products** - Tea Products
Stores individual product listings with pricing and inventory.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| category_id | UUID | NOT NULL, FK → categories | Link to category |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | - | Product description |
| price | DECIMAL(10,2) | NOT NULL, >= 0 | Regular price (₹) |
| sale_price | DECIMAL(10,2) | < price | Sale price if on offer |
| image_url | TEXT | NOT NULL | Product image URL |
| stock | INTEGER | DEFAULT 0, >= 0 | Units in stock |
| sku | VARCHAR(100) | UNIQUE | Stock keeping unit |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- idx_products_category_id
- idx_products_name
- idx_products_created_at
- idx_products_stock

**RLS Policies:**
- ✅ Public SELECT
- ✅ Admin INSERT, UPDATE, DELETE

**Constraints:**
- `sale_price` must be NULL or less than `price`
- `stock` cannot be negative
- `price` cannot be negative

---

### 3. **users** - Customer Profiles
Extended user profile information linked to Supabase Auth.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY, FK → auth.users | Links to Supabase Auth |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Customer email |
| full_name | VARCHAR(255) | - | Customer's full name |
| phone | VARCHAR(20) | - | Customer phone number |
| avatar_url | TEXT | - | Profile picture URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last profile update |

**RLS Policies:**
- ✅ Users can SELECT their own profile
- ✅ Users can UPDATE their own profile

---

### 4. **orders** - Customer Orders
Tracks all customer orders and order details.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique order identifier |
| user_id | UUID | FK → users (ON DELETE SET NULL) | Customer who placed order |
| order_number | VARCHAR(50) | NOT NULL, UNIQUE | Human-readable order ID |
| status | VARCHAR(50) | DEFAULT 'pending' | Order status |
| total_amount | DECIMAL(10,2) | NOT NULL | Total order amount (₹) |
| tax_amount | DECIMAL(10,2) | DEFAULT 0 | Tax amount (₹) |
| shipping_amount | DECIMAL(10,2) | DEFAULT 0 | Shipping cost (₹) |
| customer_email | VARCHAR(255) | NOT NULL | Email for order |
| customer_phone | VARCHAR(20) | - | Phone for delivery |
| shipping_address | TEXT | NOT NULL | Delivery address |
| notes | TEXT | - | Special instructions |
| created_at | TIMESTAMP | DEFAULT NOW() | Order date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Allowed Status Values:**
- `pending` - Order received
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Delivered
- `cancelled` - Cancelled order

**Indexes:**
- idx_orders_user_id
- idx_orders_order_number
- idx_orders_status
- idx_orders_created_at

**RLS Policies:**
- ✅ Users can SELECT their own orders
- ✅ Users can INSERT their own orders
- ✅ Admins can SELECT all orders

---

### 5. **order_items** - Order Line Items
Individual products within an order.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| order_id | UUID | NOT NULL, FK → orders | Which order |
| product_id | UUID | NOT NULL, FK → products | Which product |
| quantity | INTEGER | NOT NULL, > 0 | Number of units |
| price_at_purchase | DECIMAL(10,2) | NOT NULL | Regular price when ordered |
| sale_price_at_purchase | DECIMAL(10,2) | - | Sale price when ordered |
| created_at | TIMESTAMP | DEFAULT NOW() | When added to order |

**Indexes:**
- idx_order_items_order_id
- idx_order_items_product_id

**RLS Policies:**
- ✅ Users can VIEW items in their orders
- ✅ Admins can manage all items

---

### 6. **reviews** - Product Reviews
Customer reviews and ratings for products.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | NOT NULL, FK → products | Which product |
| user_id | UUID | FK → users (ON DELETE SET NULL) | Who wrote review |
| rating | INTEGER | NOT NULL, 1-5 | Star rating |
| title | VARCHAR(255) | - | Review title |
| comment | TEXT | - | Review text |
| helpful_count | INTEGER | DEFAULT 0 | Helpful votes |
| created_at | TIMESTAMP | DEFAULT NOW() | Review date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last edited |

**Indexes:**
- idx_reviews_product_id
- idx_reviews_user_id
- idx_reviews_rating

**RLS Policies:**
- ✅ Public SELECT
- ✅ Users can CREATE reviews
- ✅ Users can UPDATE their own reviews

---

### 7. **carts** - Shopping Carts
User shopping cart headers.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Cart identifier |
| user_id | UUID | NOT NULL, FK → users, UNIQUE | One cart per user |
| created_at | TIMESTAMP | DEFAULT NOW() | Cart creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last modification |

**Indexes:**
- idx_carts_user_id

**RLS Policies:**
- ✅ Users can SELECT their own cart
- ✅ Users can INSERT/UPDATE/DELETE their own cart

---

### 8. **cart_items** - Shopping Cart Items
Items in a user's shopping cart.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| cart_id | UUID | NOT NULL, FK → carts | Which cart |
| product_id | UUID | NOT NULL, FK → products | Which product |
| quantity | INTEGER | NOT NULL, DEFAULT 1, > 0 | How many |
| created_at | TIMESTAMP | DEFAULT NOW() | Added to cart |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last modified |

**Constraints:**
- UNIQUE(cart_id, product_id) - Can't add same product twice

**Indexes:**
- idx_cart_items_cart_id
- idx_cart_items_product_id

**RLS Policies:**
- ✅ Users can manage items in their cart

---

## Views

### 1. **products_availability**
Shows product stock status and sale information.

```sql
SELECT * FROM products_availability;
```

**Columns:**
- id, name, category_id, category_name
- price, sale_price
- stock
- availability_status ('In Stock', 'Low Stock', 'Out of Stock')
- is_on_sale (boolean)

**Example Output:**
```
| name | category_name | price | sale_price | availability_status | is_on_sale |
|------|---------------|-------|-----------|---------------------|-----------|
| Premium Assam | Assam Black Tea | 450 | 399 | In Stock | true |
| Pure Green | Green Tea | 350 | 299 | In Stock | true |
| Herbal Blend | Herbal Tea | 300 | NULL | In Stock | false |
```

---

### 2. **category_product_counts**
Shows product inventory per category.

```sql
SELECT * FROM category_product_counts;
```

**Columns:**
- id, name (category)
- product_count (total products)
- available_count (products with stock > 0)

**Example Output:**
```
| name | product_count | available_count |
|------|---------------|-----------------|
| Assam Black Tea | 2 | 2 |
| Green Tea | 3 | 3 |
| Herbal Tea | 1 | 0 |
```

---

## Common Queries

### Get Products by Category
```sql
SELECT p.* 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Assam Black Tea'
ORDER BY p.created_at DESC;
```

### Get Products on Sale
```sql
SELECT * FROM products 
WHERE sale_price IS NOT NULL 
AND sale_price < price
ORDER BY (price - sale_price) DESC;
```

### Get Low Stock Products
```sql
SELECT * FROM products 
WHERE stock > 0 AND stock <= 10
ORDER BY stock;
```

### Get Customer Order History
```sql
SELECT o.*, 
       COUNT(oi.id) as item_count,
       STRING_AGG(p.name, ', ') as products
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 'user-id'
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### Get Average Product Rating
```sql
SELECT p.name, 
       ROUND(AVG(r.rating), 2) as avg_rating,
       COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC NULLS LAST;
```

---

## Data Constraints & Validation

### Price Validation
- Regular price (`price`) must be ≥ 0
- Sale price (`sale_price`) if set, must be:
  - ≥ 0
  - < regular `price`
  
```sql
CONSTRAINT valid_prices CHECK (sale_price IS NULL OR sale_price < price)
```

### Stock Validation
- Stock quantity must be ≥ 0
- Automatically prevents negative inventory

```sql
CHECK (stock >= 0)
```

### Unique Constraints
- Category names are unique
- Product SKUs are unique
- Order numbers are unique
- User emails are unique

### Referential Integrity
- Products must reference valid category
- Orders must reference valid user (or NULL if deleted)
- Order items must reference valid order and product
- Reviews must reference valid product

---

## Automatic Features

### Updated Timestamps
All tables have triggers that automatically update `updated_at` when records are modified:

```sql
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### Cascade Deletes
- Deleting a category deletes all its products
- Deleting an order deletes all its line items
- Deleting a cart deletes all its items

---

## Performance Considerations

✅ **Implemented:**
- Indexes on foreign keys for fast joins
- Indexes on frequently searched fields (name, created_at)
- Indexes on status and stock fields
- Constraints prevent invalid data
- Views optimize complex queries

📊 **Recommended Monitoring:**
- Monitor table sizes (especially orders and order_items)
- Check index usage in Supabase dashboard
- Archive old orders periodically
- Monitor slow queries in logs

---

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

**Public Access:**
- Read categories and products
- Read reviews

**User-Scoped Access:**
- Can only see/modify own data (orders, cart, profile)

**Admin Access:**
- Can manage all data

See `001_initial_schema.sql` for detailed policy definitions.

---

## Backup Strategy

Supabase automatically handles:
- Daily automated backups
- 7-day backup retention
- Point-in-time recovery

Manual backups:
- Go to Project Settings → Database → Backups
- Request backup anytime
- Download/restore as needed

---

## Schema Version

**Current Version:** 1.0  
**Last Updated:** 2024  
**Migration File:** `001_initial_schema.sql`

For updates and new features, new migration files will be created following semantic versioning.

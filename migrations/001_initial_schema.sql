-- ============================================================================
-- Foodistics E-Commerce Database Migration - Complete Schema
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at);

-- ============================================================================
-- STEP 2: CREATE PRODUCTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price)),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- ============================================================================
-- STEP 3: CREATE USERS TABLE (Optional - for future authentication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- STEP 4: CREATE ORDERS TABLE (Optional - for future e-commerce)
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  shipping_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- STEP 5: CREATE ORDER_ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  sale_price_at_purchase DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- STEP 6: CREATE REVIEWS TABLE (Optional - for product ratings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- STEP 7: CREATE CART TABLE (Optional - for persistent shopping carts)
-- ============================================================================

CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================================
-- STEP 8: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES - PUBLIC ACCESS (Read-only)
-- ============================================================================

-- Categories: Everyone can read
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);

-- Products: Everyone can read
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Reviews: Everyone can read
CREATE POLICY "Allow public read access" ON reviews
  FOR SELECT USING (true);

-- ============================================================================
-- STEP 10: CREATE RLS POLICIES - AUTHENTICATED USER ACCESS
-- ============================================================================

-- Users: Users can only read/write their own data
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can only access their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: Users can only view items in their orders
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Reviews: Users can view and create reviews
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Carts: Users can only access their own cart
CREATE POLICY "Users can view their own cart" ON carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart" ON carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON carts
  FOR UPDATE USING (auth.uid() = user_id);

-- Cart Items: Users can manage items in their cart
CREATE POLICY "Users can view their cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to their cart" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their cart" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their cart" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 11: CREATE RLS POLICIES - ADMIN ACCESS (if using custom admin role)
-- ============================================================================

-- Admins can manage all products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can manage all categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- STEP 12: CREATE FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 13: CREATE USEFUL VIEWS
-- ============================================================================

-- View for product availability
CREATE OR REPLACE VIEW products_availability AS
SELECT 
  p.id,
  p.name,
  p.category_id,
  c.name as category_name,
  p.price,
  p.sale_price,
  p.stock,
  CASE 
    WHEN p.stock = 0 THEN 'Out of Stock'
    WHEN p.stock <= 10 THEN 'Low Stock'
    ELSE 'In Stock'
  END as availability_status,
  (p.sale_price IS NOT NULL AND p.sale_price < p.price) as is_on_sale
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- View for category product counts
CREATE OR REPLACE VIEW category_product_counts AS
SELECT 
  c.id,
  c.name,
  COUNT(p.id) as product_count,
  COUNT(CASE WHEN p.stock > 0 THEN 1 END) as available_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- ============================================================================
-- STEP 14: INSERT SAMPLE DATA (Optional)
-- ============================================================================

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Assam Black Tea', 'Rich and robust black tea from Assam region of India', 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500'),
  ('Green Tea', 'Fresh and healthy green tea with antioxidants', 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500'),
  ('Herbal Tea', 'Natural herbal blends for relaxation and wellness', 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500'),
  ('Masala Chai', 'Aromatic spiced tea blend with traditional flavors', 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500'),
  ('Premium Gold Blend', 'Exclusive premium tea blend with special grading', 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, sale_price, image_url, stock, sku) VALUES
  ((SELECT id FROM categories WHERE name = 'Assam Black Tea'), 'Premium Assam Black Tea', 'High quality loose leaf Assam tea with full body and malty notes', 450.00, 399.00, 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500', 50, 'ASSAM-001'),
  ((SELECT id FROM categories WHERE name = 'Green Tea'), 'Pure Green Tea', 'Fresh, delicate green tea leaves with subtle vegetal notes', 350.00, 299.00, 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500', 40, 'GREEN-001'),
  ((SELECT id FROM categories WHERE name = 'Herbal Tea'), 'Organic Herbal Blend', 'Caffeine-free herbal blend with chamomile and lemongrass', 300.00, NULL, 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500', 35, 'HERB-001'),
  ((SELECT id FROM categories WHERE name = 'Masala Chai'), 'Traditional Masala Chai', 'Authentic spiced tea blend with cloves, cardamom, and cinnamon', 280.00, 239.00, 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500', 60, 'MASALA-001'),
  ((SELECT id FROM categories WHERE name = 'Premium Gold Blend'), 'Golden Reserve Tea', 'Exclusive premium blend with golden tips and superior quality', 650.00, 599.00, 'https://images.unsplash.com/photo-1597318972403-20ceeeafcd0c?w=500', 25, 'GOLD-001')
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- STEP 15: VERIFY SETUP
-- ============================================================================

-- Check all tables are created
SELECT 
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check category and product counts
SELECT 
  'Categories' as entity,
  COUNT(*) as count
FROM categories
UNION ALL
SELECT 
  'Products' as entity,
  COUNT(*) as count
FROM products;

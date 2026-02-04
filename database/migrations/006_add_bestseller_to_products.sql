-- Add bestseller column to products table
ALTER TABLE products ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE;

-- Create index for faster bestseller queries
CREATE INDEX idx_products_is_bestseller ON products(is_bestseller);

-- Migration: Add product_name to order_items
-- Date: February 4, 2026
-- Purpose: Store product name with each order item so we can display it without joining tables

-- ============================================================================
-- STEP 1: Add product_name column if it doesn't exist
-- ============================================================================
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);

-- ============================================================================
-- STEP 2: Add product_image_url column for displaying product image
-- ============================================================================
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_image_url VARCHAR(500);

-- ============================================================================
-- STEP 3: Create index for faster queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================================================
-- TESTING: After running this migration
-- ============================================================================
-- In app: When placing a new order, order_items should have:
-- - product_id (already exists)
-- - product_name (NEW - filled during checkout)
-- - product_image_url (NEW - filled during checkout)
-- - quantity (already exists)
-- - price_at_purchase (already exists)
-- - sale_price_at_purchase (already exists)
--
-- Then in admin orders view, product name and image will display

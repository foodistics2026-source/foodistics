-- Migration: Populate product_name from products table
-- Date: February 4, 2026
-- Purpose: Fill product_name column for existing orders using product name from products table

-- ============================================================================
-- Update existing order_items with null product_name to use product name
-- ============================================================================
UPDATE order_items
SET product_name = products.name
FROM products
WHERE order_items.product_id = products.id
AND order_items.product_name IS NULL;

-- ============================================================================
-- Create a trigger to automatically set product_name on INSERT
-- ============================================================================
CREATE OR REPLACE FUNCTION set_order_item_product_name()
RETURNS TRIGGER AS $$
BEGIN
  -- If product_name is not provided, get it from products table
  IF NEW.product_name IS NULL THEN
    SELECT name INTO NEW.product_name
    FROM products
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS order_items_set_product_name_trigger ON order_items;

-- Create the trigger
CREATE TRIGGER order_items_set_product_name_trigger
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION set_order_item_product_name();

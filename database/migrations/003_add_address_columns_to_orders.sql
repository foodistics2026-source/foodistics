-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_method_id UUID REFERENCES shipping_methods(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;

-- Modify NOT NULL columns to allow NULL (since we use foreign keys instead)
ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN customer_phone DROP NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_subtotal ON orders(subtotal);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_method_id ON orders(shipping_method_id);
CREATE INDEX IF NOT EXISTS idx_orders_billing_address_id ON orders(billing_address_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_id ON orders(shipping_address_id);

-- Shipping Methods Table
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  rate DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on shipping_methods
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active shipping methods
CREATE POLICY "Anyone can view active shipping methods"
  ON shipping_methods
  FOR SELECT
  USING (is_active = true);

-- Policy: Only admins can insert shipping methods
CREATE POLICY "Only admins can create shipping methods"
  ON shipping_methods
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Policy: Only admins can update shipping methods
CREATE POLICY "Only admins can update shipping methods"
  ON shipping_methods
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Policy: Only admins can delete shipping methods
CREATE POLICY "Only admins can delete shipping methods"
  ON shipping_methods
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Create index for faster queries
CREATE INDEX idx_shipping_methods_active ON shipping_methods(is_active);

-- Orders Table - Add shipping_method_id if not exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method_id UUID REFERENCES shipping_methods(id);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_shipping_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shipping_methods_updated_at_trigger ON shipping_methods;
CREATE TRIGGER shipping_methods_updated_at_trigger
  BEFORE UPDATE ON shipping_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_shipping_methods_updated_at();

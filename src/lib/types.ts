import { supabase } from '@/lib/supabase';

export interface Address {
  id: string;
  user_id: string;
  type: 'billing' | 'shipping' | 'both';
  is_default: boolean;
  full_name: string;
  phone: string;
  street_address: string;
  street_address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  products?: any;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  sale_price_at_purchase?: number;
  created_at: string;
  products?: any;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: 'card' | 'upi' | 'wallet';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  billing_address_id: string;
  shipping_address_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'upi' | 'wallet';
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Re-export existing types and client
export { supabase };

// Add new export types to existing supabase.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  rate: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

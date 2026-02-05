import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Address, CartItem, Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sendOrderNotificationToTelegram } from '@/lib/telegram';

// ============= ADDRESS HOOKS =============

export const useAddresses = (userId: string) => {
  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (address: Omit<Address, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('addresses')
        .insert([address])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', variables.user_id] });
      toast({
        title: 'Success',
        description: 'Address added successfully',
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...address }: Address) => {
      const { data, error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// ============= CART HOOKS =============

export const useCart = (userId: string) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useCartItems = (userId: string) => {
  return useQuery({
    queryKey: ['cartItems', userId],
    queryFn: async () => {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!cart) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products:product_id(*)')
        .eq('cart_id', cart.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!userId,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      quantity = 1,
    }: {
      userId: string;
      productId: string;
      quantity?: number;
    }) => {
      // Get or create cart
      const { data: existingCart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      let cartId = existingCart?.id;

      if (!cartId) {
        const { data: newCart, error: cartError } = await supabase
          .from('carts')
          .insert([{ user_id: userId }])
          .select()
          .single();
        if (cartError) throw cartError;
        cartId = newCart.id;
      }

      // Add or update item
      const { data, error } = await supabase
        .from('cart_items')
        .upsert(
          {
            cart_id: cartId,
            product_id: productId,
            quantity,
          },
          { onConflict: 'cart_id,product_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', variables.userId] });
      toast({
        title: 'Success',
        description: 'Added to cart',
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (cart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);
        if (error) throw error;
      }
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', userId] });
    },
  });
};

// ============= ORDER HOOKS =============

export const useOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: {
      user_id: string;
      order_number: string;
      subtotal: number;
      tax_amount: number;
      shipping_amount: number;
      total_amount: number;
      billing_address_id: string;
      shipping_address_id: string;
      items: Array<{ product_id: string; product_name: string; quantity: number; price_at_purchase: number; sale_price_at_purchase?: number }>;
    }) => {
      const { items, ...order } = orderData;

      // Create order with default status as 'processing'
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([{ ...order, status: 'processing' }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items with product name
      const orderItems = items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        sale_price_at_purchase: item.sale_price_at_purchase,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update product stock for each item
      for (const item of items) {
        const { data: product, error: productFetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (productFetchError) {
          continue;
        }

        const newStock = Math.max(0, (product?.stock || 0) - item.quantity);

        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);

        if (updateError) {
          // Silent error
        }
      }

      // Send Telegram notification to admin
      try {
        const userInfo = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', order.user_id)
          .single();

        if (userInfo.data) {
          sendOrderNotificationToTelegram({
            orderId: newOrder.id,
            orderNumber: order.order_number,
            customerName: userInfo.data.full_name || 'Customer',
            customerEmail: userInfo.data.email || 'N/A',
            totalAmount: order.total_amount,
            itemCount: items.length,
            items: items.map((item) => ({
              productName: item.product_name,
              quantity: item.quantity,
              price: item.price_at_purchase,
            })),
          }).catch((err) => {
            console.error('Failed to send Telegram notification:', err);
            // Don't throw error, just log it
          });
        }
      } catch (error) {
        console.error('Error fetching user info for Telegram notification:', error);
      }

      return newOrder;
    },
    onSuccess: (data, variables) => {
      // Invalidate all order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders', variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ['cartItems', variables.user_id] });
      
      // Invalidate product queries to refresh stock
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
      // Force refetch of admin orders
      queryClient.refetchQueries({ queryKey: ['admin-orders'] });
      
      toast({
        title: 'Success',
        description: 'Order placed successfully',
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status: status.trim() })
          .eq('id', orderId)
          .select('id, status')
          .single();

        if (error) {
          throw new Error(`Failed to update status: ${error.message}`);
        }

        if (!data) {
          throw new Error('No data returned from update');
        }

        return data;
      } catch (err: any) {
        throw new Error(err.message || 'Unknown error updating order status');
      }
    },
    onSuccess: () => {
      // Invalidate both admin and user orders to sync changes
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// ============= PAYMENT HOOKS =============

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      order_id: string;
      amount: number;
      payment_method: string;
    }) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      status,
      transactionId,
    }: {
      paymentId: string;
      status: string;
      transactionId?: string;
    }) => {
      const updates: any = { status };
      if (transactionId) updates.transaction_id = transactionId;

      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

// ============= SHIPPING HOOKS =============

export const useShippingMethods = () => {
  return useQuery({
    queryKey: ['shipping-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateShippingMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (method: { name: string; rate: number; description?: string }) => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .insert([
          {
            ...method,
            is_active: true,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast({
        title: 'Success',
        description: 'Shipping method created',
      });
    },
  });
};

export const useUpdateShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; rate?: number; description?: string; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
    },
  });
};

export const useDeleteShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('shipping_methods')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
    },
  });
};

// ============= ADMIN ORDERS HOOK =============

export const useAdminOrders = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        // Get all orders with basic user data
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            user_id,
            order_number,
            status,
            subtotal,
            tax_amount,
            shipping_amount,
            total_amount,
            billing_address_id,
            shipping_address_id,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });
        
        if (ordersError) {
          throw ordersError;
        }

        if (!orders || orders.length === 0) {
          return [];
        }

        // Get order IDs for filtering
        const orderIds = orders.map(o => o.id);

        // Get address IDs we need
        const addressIds = orders
          .map(o => o.shipping_address_id)
          .filter(Boolean);

        // Get addresses data - fetch by specific IDs to bypass RLS
        let addresses: any[] = [];
        if (addressIds.length > 0) {
          const { data: addr } = await supabase
            .from('addresses')
            .select('*')
            .in('id', addressIds);
          addresses = addr || [];
        }

        // Get order items - join with orders to help bypass RLS
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            price_at_purchase,
            sale_price_at_purchase
          `)
          .in('order_id', orderIds);

        // Get products
        const { data: products } = await supabase
          .from('products')
          .select('id, name, image_url');

        // Get user data
        const { data: users } = await supabase
          .from('users')
          .select('id, email, full_name');

        // Merge data manually
        const enrichedOrders = orders.map(order => {
          const shippingAddress = addresses?.find(a => a.id === order.shipping_address_id);
          const items = (orderItems || []).filter(item => item.order_id === order.id);
          const user = users?.find(u => u.id === order.user_id);
          
          const itemsWithProducts = items.map(item => {
            const matchedProduct = products?.find(p => p.id === item.product_id);
            return {
              ...item,
              products: matchedProduct || null,
            };
          });

          return {
            ...order,
            shipping_address: shippingAddress,
            order_items: itemsWithProducts,
            users: user || {
              id: order.user_id,
              email: 'User',
              full_name: 'User',
            },
          };
        });

        return enrichedOrders;
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
    staleTime: 5000,
    gcTime: 10000,
  });
};



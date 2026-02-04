import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  price: number;
  price_at_purchase: number;
  sale_price_at_purchase?: number;
  products: {
    id: string;
    name: string;
    image_url: string;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  subtotal?: number;
  shipping_amount?: number;
  created_at: string;
  order_items?: OrderItem[];
}

const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            user_id,
            status,
            total_amount,
            subtotal,
            shipping_amount,
            created_at,
            order_items (
              id,
              order_id,
              product_id,
              product_name,
              quantity,
              price_at_purchase,
              sale_price_at_purchase,
              products (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user orders:', error);
          throw error;
        }
        return data as any as Order[];
      } catch (err) {
        console.error('User orders query error:', err);
        throw err;
      }
    },
  });
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; color: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', color: 'yellow' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', color: 'blue' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800', color: 'purple' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', color: 'green' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', color: 'red' },
  };
  const style = statusMap[status] || statusMap.pending;
  return <Badge className={`${style.bg} ${style.text} border-0`}>{status.toUpperCase()}</Badge>;
};

const getStatusProgress = (status: string): number => {
  const statusProgressMap: Record<string, number> = {
    pending: 25,
    processing: 50,
    shipped: 75,
    delivered: 100,
    cancelled: 0,
  };
  return statusProgressMap[status] || 0;
};

const getStatusProgressColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };
  return colorMap[status] || 'bg-gray-400';
};

export default function Orders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, refetch } = useUserOrders(user?.id || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Real-time subscription for order status updates
  useEffect(() => {
    if (!user) return;

    try {
      const subscription = supabase
        .channel(`user-orders-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // Refetch orders to get latest data
            refetch();
            // If we have a selected order open, update it too
            if (selectedOrder && selectedOrder.id === payload.new.id) {
              setSelectedOrder({
                ...selectedOrder,
                status: payload.new.status,
              });
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Subscription error:', err);
    }
  }, [user, refetch, selectedOrder]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center mt-20">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-600">You need to be logged in to view your orders.</p>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
    <div className="min-h-[calc(100vh-80px)] bg-muted/30 py-12 mt-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground text-lg">
            Track your orders and view order history
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-tea-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start shopping to create your first order!
            </p>
            <a href="/shop">
              <Button className="bg-tea-gold hover:bg-tea-gold/90">
                Continue Shopping
              </Button>
            </a>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    {/* Header with Order ID and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Order</p>
                        <h3 className="text-sm font-bold font-serif">
                          {order.id.substring(0, 8).toUpperCase()}
                        </h3>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Status Progress Bar - Compact */}
                    <div className="mb-3">
                      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStatusProgressColor(order.status)} transition-all duration-500 rounded-full`}
                          style={{ width: `${getStatusProgress(order.status)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1.5 px-1">
                        <span className={order.status === 'pending' ? 'text-gray-900 font-medium' : ''}>●</span>
                        <span className={['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-gray-900 font-medium' : ''}>●</span>
                        <span className={['shipped', 'delivered'].includes(order.status) ? 'text-gray-900 font-medium' : ''}>●</span>
                        <span className={order.status === 'delivered' ? 'text-gray-900 font-medium' : ''}>●</span>
                      </div>
                    </div>

                    {/* Compact Summary */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="text-sm font-semibold">
                          {order.order_items?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-bold text-tea-gold">
                          ₹{order.total_amount.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-xs font-medium">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit'
                        })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => {
                          // Get fresh data before opening dialog
                          const freshOrder = orders.find(o => o.id === order.id);
                          setSelectedOrder(freshOrder || order);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span className="text-xs">Details</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Order {selectedOrder.id.substring(0, 8).toUpperCase()}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Status</p>
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusBadge(selectedOrder.status)}
                    <p className="text-sm text-gray-600">
                      {selectedOrder.status === 'pending' && 'Awaiting confirmation'}
                      {selectedOrder.status === 'processing' && 'Order processing - preparing shipment'}
                      {selectedOrder.status === 'shipped' && 'Order shipped - on the way'}
                      {selectedOrder.status === 'delivered' && 'Order delivered'}
                      {selectedOrder.status === 'cancelled' && 'Order cancelled'}
                    </p>
                  </div>
                  
                  {/* Status Progress Bar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Order Journey</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStatusProgressColor(selectedOrder.status)} transition-all duration-500`}
                            style={{ width: `${getStatusProgress(selectedOrder.status)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span className={selectedOrder.status === 'pending' || getStatusProgress(selectedOrder.status) >= 25 ? 'text-gray-800' : 'text-gray-400'}>
                        📋 Pending
                      </span>
                      <span className={selectedOrder.status === 'processing' || getStatusProgress(selectedOrder.status) >= 50 ? 'text-gray-800' : 'text-gray-400'}>
                        ⚙️ Processing
                      </span>
                      <span className={selectedOrder.status === 'shipped' || getStatusProgress(selectedOrder.status) >= 75 ? 'text-gray-800' : 'text-gray-400'}>
                        🚚 Shipped
                      </span>
                      <span className={selectedOrder.status === 'delivered' || getStatusProgress(selectedOrder.status) === 100 ? 'text-gray-800' : 'text-gray-400'}>
                        ✅ Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-4">Items</p>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                      selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {item.product_name || item.products?.name || 'Product'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{(item.sale_price_at_purchase || item.price_at_purchase).toFixed(0)}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₹{(item.quantity * (item.sale_price_at_purchase || item.price_at_purchase)).toFixed(0)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items in this order</p>
                    )}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{(selectedOrder.subtotal || selectedOrder.total_amount * 0.95).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ₹{(selectedOrder.shipping_amount || 0).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-tea-gold">₹{selectedOrder.total_amount.toFixed(0)}</span>
                  </div>
                </div>

                {/* Order Date */}
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  <p>
                    Order placed on{' '}
                    <strong>
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
      <Footer />
    </>
  );
}

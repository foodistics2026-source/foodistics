import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, RefreshCw, CheckCircle, Truck, Package, AlertCircle } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useEcommerce';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price?: number;
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
  order_number: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  users: {
    email: string;
    full_name: string;
  } | null;
  order_items?: OrderItem[];
}

export const OrdersTable = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: allOrders = [], isLoading, error, refetch } = useAdminOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=');
    audio.play().catch(() => {
      // Fallback: Create a simple beep using Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    });
  };

  // Show all orders except delivered ones (remove only after delivery)
  const orders = allOrders.filter(order => order.status !== 'delivered');

  // New order notification with sound
  useEffect(() => {
    if (orders.length > previousOrderCount && previousOrderCount > 0) {
      playNotificationSound();
      setNewOrderAlert(true);
      setTimeout(() => setNewOrderAlert(false), 5000);
    }
    setPreviousOrderCount(orders.length);
  }, [orders.length, previousOrderCount]);

  // ============================================================================
  // REAL-TIME SUBSCRIPTION: Listen for new/updated orders
  // ============================================================================
  useEffect(() => {
    try {
      const subscription = supabase
        .channel('orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          (payload) => {
            const newOrder = payload.new as Order;
            const oldOrder = payload.old as Order;

            // Check if it's a new order (INSERT) with pending status
            if (payload.eventType === 'INSERT' && newOrder.status === 'pending') {
              playNotificationSound();
              setNewOrderAlert(true);
              setTimeout(() => setNewOrderAlert(false), 5000);
              toast({
                title: '🎉 New Order!',
                description: `Order ${newOrder.order_number} received`,
              });
              refetch();
            }
            // Check if status changed (UPDATE)
            else if (payload.eventType === 'UPDATE' && oldOrder.status !== newOrder.status) {
              toast({
                title: 'Order Updated',
                description: `Order ${newOrder.order_number} status changed to ${newOrder.status}`,
              });
              // Only refetch if the order is still pending, otherwise it will auto-remove
              if (newOrder.status === 'pending') {
                refetch();
              } else {
                // Remove from list if status changed away from pending
                refetch();
              }
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
  }, [refetch, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      setSelectedOrder(null);
      toast({
        title: 'Success',
        description: `Order status updated to ${newStatus}`,
      });
      await refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const style = statusMap[status] || statusMap.pending;
    return <Badge className={`${style.bg} ${style.text} border-0`}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tea-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="border border-red-200 rounded-lg bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 mb-2">Error Loading Orders</p>
              <p className="text-sm text-red-700 mb-4">
                {error instanceof Error ? error.message : 'Failed to load orders'}
              </p>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-tea-gold hover:bg-tea-gold/90"
              >
                {isRefreshing ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New Order Alert */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-green-900">🎉 New Order Received!</p>
            <p className="text-sm text-green-700">A new order has just arrived.</p>
          </div>
          <button
            onClick={() => setNewOrderAlert(false)}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Debug Info */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex justify-between">
        <span>Total Orders: {allOrders.length} | Pending: {orders.length}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 h-6 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Orders Table - Desktop & Mobile */}
      <div className="border rounded-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <p className="text-gray-500 text-lg font-medium">No pending orders</p>
            <p className="text-gray-400 text-sm mt-2">All orders have been confirmed or processed</p>
          </div>
        ) : (
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-semibold text-sm">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{order.users?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">{order.users?.email || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-tea-gold">₹{order.total_amount.toFixed(0)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Mobile Card Layout */}
        {orders.length > 0 && (
          <div className="md:hidden space-y-3 p-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 border-2 border-tea-gold/20 hover:border-tea-gold/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{order.users?.full_name}</p>
                      <p className="text-xs text-gray-500">Order: {order.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-tea-gold">₹{order.total_amount.toFixed(0)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Contact & Date */}
                  <div className="flex justify-between items-center pt-2 border-t text-xs">
                    <a 
                      href={`tel:${order.shipping_address?.phone}`}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📞 {order.shipping_address?.phone}
                    </a>
                    <p className="text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Items Preview */}
                  <div className="text-xs text-gray-600 pt-1">
                    <p className="font-semibold">Items: {order.order_items?.length || 0}</p>
                  </div>

                  {/* View Button */}
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold">{selectedOrder.users?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{selectedOrder.users?.email}</p>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="text-sm space-y-1">
                  <p>{selectedOrder.shipping_address?.street_address}</p>
                  <p>
                    {selectedOrder.shipping_address?.city} {selectedOrder.shipping_address?.postal_code}
                  </p>
                  <p>{selectedOrder.shipping_address?.state}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <a 
                      href={`tel:${selectedOrder.shipping_address?.phone}`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition"
                    >
                      📞 Call: {selectedOrder.shipping_address?.phone}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-4 border-0">
                <h3 className="font-semibold mb-4">Products Ordered</h3>
                <div className="space-y-4">
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        {item.products?.image_url && (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product_name || item.products?.name || 'Product'}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{(item.sale_price_at_purchase || item.price_at_purchase).toFixed(0)}
                          </p>
                        </div>
                        <p className="font-semibold text-tea-gold">
                          ₹{(item.quantity * (item.sale_price_at_purchase || item.price_at_purchase)).toFixed(0)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items in this order</p>
                  )}
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="p-4 border-0 bg-tea-gold/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{selectedOrder.order_items?.reduce((sum, item) => sum + (item.sale_price_at_purchase || item.price_at_purchase) * item.quantity, 0).toFixed(0) || '0'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-tea-gold/20">
                    <span>Total</span>
                    <span className="text-tea-gold">₹{selectedOrder.total_amount.toFixed(0)}</span>
                  </div>
                </div>
              </Card>

              {/* Status Update Buttons */}
              <Card className="p-4 border-0">
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                    disabled={updateOrderStatus.isPending}
                    className={selectedOrder.status === 'processing' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                    disabled={updateOrderStatus.isPending}
                    className={selectedOrder.status === 'shipped' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Shipped
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                    disabled={updateOrderStatus.isPending}
                    className={selectedOrder.status === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Delivered
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

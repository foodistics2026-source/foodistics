import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { useAdminOrders } from '@/hooks/useEcommerce';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function OrderAnalytics() {
  const { data: allOrders = [], isLoading } = useAdminOrders();
  const [viewType, setViewType] = useState<'week' | 'month'>('month');

  // Calculate analytics
  const analytics = useMemo(() => {
    if (!allOrders.length) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingCount: 0,
        processingCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        grouped: [],
      };
    }

    // Only include SHIPPED orders in analytics
    const shippedOrders = allOrders.filter(o => o.status === 'shipped');
    
    const totalOrders = shippedOrders.length;
    const totalRevenue = shippedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;
    const pendingCount = allOrders.filter(o => o.status === 'pending').length;
    const processingCount = allOrders.filter(o => o.status === 'processing').length;
    const shippedCount = shippedOrders.length;
    const deliveredCount = allOrders.filter(o => o.status === 'delivered').length;

    // Group by period - only shipped orders
    const grouped = new Map<string, any>();

    shippedOrders.forEach(order => {
      const date = new Date(order.created_at);
      let key: string;

      if (viewType === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        key = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          period: key,
          orders: [],
          revenue: 0,
          count: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
        });
      }

      const period = grouped.get(key);
      period.orders.push(order);
      period.revenue += order.total_amount || 0;
      period.count += 1;
      period.shipped += 1;
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      grouped: Array.from(grouped.values()),
    };
  }, [allOrders, viewType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tea-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{analytics.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-900 mt-2">₹{analytics.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">₹{analytics.averageOrderValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{analytics.pendingCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600 opacity-50" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Status Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge className="bg-yellow-100 text-yellow-800 text-lg py-2 px-4 mb-2 w-full justify-center">
              {analytics.pendingCount}
            </Badge>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-800 text-lg py-2 px-4 mb-2 w-full justify-center">
              {analytics.processingCount}
            </Badge>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <div className="text-center">
            <Badge className="bg-purple-100 text-purple-800 text-lg py-2 px-4 mb-2 w-full justify-center">
              {analytics.shippedCount}
            </Badge>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 text-lg py-2 px-4 mb-2 w-full justify-center">
              {analytics.deliveredCount}
            </Badge>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
        </div>
      </Card>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewType === 'week' ? 'default' : 'outline'}
          onClick={() => setViewType('week')}
          className={viewType === 'week' ? 'bg-tea-gold hover:bg-tea-gold/90' : ''}
        >
          Weekly
        </Button>
        <Button
          variant={viewType === 'month' ? 'default' : 'outline'}
          onClick={() => setViewType('month')}
          className={viewType === 'month' ? 'bg-tea-gold hover:bg-tea-gold/90' : ''}
        >
          Monthly
        </Button>
      </div>

      {/* Grouped Analytics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Orders by {viewType === 'week' ? 'Week' : 'Month'}</h3>
        {analytics.grouped.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No orders to display
          </Card>
        ) : (
          analytics.grouped.map((period, idx) => (
            <motion.div
              key={period.period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Period</p>
                    <p className="font-semibold">{period.period}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Orders</p>
                    <p className="font-semibold text-xl">{period.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Revenue</p>
                    <p className="font-semibold text-tea-gold text-lg">₹{period.revenue.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Avg Value</p>
                    <p className="font-semibold">{(period.revenue / period.count).toFixed(0)}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {period.pending > 0 && <Badge className="bg-yellow-100 text-yellow-800">Pending: {period.pending}</Badge>}
                    {period.processing > 0 && <Badge className="bg-blue-100 text-blue-800">Processing: {period.processing}</Badge>}
                    {period.shipped > 0 && <Badge className="bg-purple-100 text-purple-800">Shipped: {period.shipped}</Badge>}
                    {period.delivered > 0 && <Badge className="bg-green-100 text-green-800">Delivered: {period.delivered}</Badge>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

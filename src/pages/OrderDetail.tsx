import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuth";
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  useAuthRedirect();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          address:addresses(id, street, city, state, pincode, phone),
          payment:payments(id, amount, payment_method, status, created_at),
          order_items(id, quantity, price, product:products(id, name, image_url, sku))
        `
        )
        .eq("id", id)
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20 mb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tea-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20 mb-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Order not found</p>
            <Button onClick={() => navigate("/account")}>Back to Account</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderItems = (order as any).order_items || [];
  const payment = (order as any).payment?.[0];
  const address = (order as any).address;
  const subtotal = orderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 100;
  const total = subtotal + tax + shipping;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 overflow-y-auto mt-20 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate("/account")}
          className="flex items-center gap-2 text-tea-gold mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge className={`text-lg px-4 py-1 ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package size={24} className="text-tea-gold" />
                Order Items
              </h2>

              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                          No image
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          SKU: {item.product?.sku}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{(item.price * item.quantity).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-tea-gold" />
                Shipping Address
              </h2>

              <div className="text-gray-700">
                <p className="font-semibold mb-2">{address?.street}</p>
                <p>{address?.city}, {address?.state} {address?.pincode}</p>
                <p className="mt-2">Phone: {address?.phone}</p>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            {/* Payment Info */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={24} className="text-tea-gold" />
                Payment
              </h2>

              {payment && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-semibold">
                      {payment.payment_method.charAt(0).toUpperCase() +
                        payment.payment_method.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      className={`text-xs ${getPaymentStatusColor(payment.status)}`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Order Timeline */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={24} className="text-tea-gold" />
                Status Timeline
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-tea-gold"></div>
                    {["pending", "confirmed", "shipped", "delivered"].includes(
                      order.status
                    ) && <div className="w-1 h-8 bg-tea-gold"></div>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-tea-gold"></div>
                      {["shipped", "delivered"].includes(order.status) && (
                        <div className="w-1 h-8 bg-tea-gold"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order Confirmed
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {["shipped", "delivered"].includes(order.status) && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-tea-gold"></div>
                      {order.status === "delivered" && (
                        <div className="w-1 h-8 bg-tea-gold"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Shipped</p>
                      <p className="text-sm text-gray-600">On its way</p>
                    </div>
                  </div>
                )}

                {order.status === "delivered" && (
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-tea-gold"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-600">
                        Delivered successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Price Breakdown */}
            <Card className="p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-tea-gold">₹{total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex-1"
          >
            Print Invoice
          </Button>
          <Button
            onClick={() => navigate("/shop")}
            className="flex-1 bg-tea-gold hover:bg-amber-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useCartItems, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useEcommerce';
import { CartItemModal } from '@/components/CartItemModal';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cartItems = [] } = useCartItems(user?.id || '');
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [removeItemId, setRemoveItemId] = useState<string | null>(null);
  const [removeItemName, setRemoveItemName] = useState<string>('');

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = item.products;
      const price = product?.sale_price || product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20 mb-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in to view your cart</h2>
            <Button
              onClick={() => navigate('/auth/signin')}
              className="bg-tea-gold hover:bg-tea-gold/90"
            >
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      <div className="flex-1 overflow-y-auto mt-20 mb-20">
        <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-tea-gold hover:bg-tea-gold/90 font-semibold px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow border-0"
                >
                  <img
                    src={item.products?.image_url}
                    alt={item.products?.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.products?.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.products?.description}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-tea-gold">
                        ₹{(item.products?.sale_price || item.products?.price).toFixed(0)}
                      </span>
                      {item.products?.sale_price && (
                        <span className="text-sm line-through text-gray-400">
                          ₹{item.products?.price.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRemoveItemId(item.id);
                        setRemoveItemName(item.products?.name || 'Item');
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          updateCartItem.mutate({
                            itemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          updateCartItem.mutate({
                            itemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 h-fit sticky top-24 shadow-lg border-0">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.products?.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{((item.products?.sale_price || item.products?.price || 0) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-tea-gold">₹{cartTotal.toFixed(0)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold py-3 rounded-lg"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => navigate('/shop')}
                  className="w-full mt-3 text-tea-gold hover:text-tea-gold/90"
                >
                  Continue Shopping
                </Button>
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>

      <CartItemModal
        cartItemId={removeItemId || ''}
        productName={removeItemName}
        open={!!removeItemId}
        onOpenChange={(open) => {
          if (!open) setRemoveItemId(null);
        }}
        onSuccess={() => {
          setRemoveItemId(null);
        }}
      />

      <Footer />
    </div>
  );
}

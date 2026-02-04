import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartItems, useUpdateCartItem, useRemoveFromCart, useCreateOrder, useClearCart } from '@/hooks/useEcommerce';
import { useToast } from '@/components/ui/use-toast';
import { CartItemModal } from './CartItemModal';
import { CheckoutModal } from './CheckoutModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { user } = useAuth();
  const { data: cartItems = [] } = useCartItems(user?.id || '');
  const { toast } = useToast();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [removeItemId, setRemoveItemId] = useState<string | null>(null);
  const [removeItemName, setRemoveItemName] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = item.products;
      const price = product?.sale_price || product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  if (!user || cartItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-lg text-gray-600 text-center mb-6">Your cart is empty</p>
            <Button
              onClick={onClose}
              className="bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Shopping Cart ({cartItems.length} items)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 flex gap-4 shadow-sm border-0">
                <img
                  src={item.products?.image_url}
                  alt={item.products?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.products?.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                    {item.products?.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-tea-gold">
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

            {/* Order Summary */}
            <Card className="p-6 bg-tea-gold/5 border-tea-gold/20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-tea-gold">₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsCheckoutOpen(true);
                    onClose(); // Close CartModal when opening CheckoutModal
                  }}
                  className="flex-1 bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold py-6"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-tea-gold text-tea-gold"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card>
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
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}

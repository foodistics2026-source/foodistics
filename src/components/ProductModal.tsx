import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useEcommerce';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface ProductModalProps {
  product: any;
  reviews?: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckoutOpen?: () => void;
  onBuyNow?: (product: any, quantity: number) => void;
}

export function ProductModal({
  product,
  reviews = [],
  open,
  onOpenChange,
  onCheckoutOpen,
  onBuyNow,
}: ProductModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const salePrice = product?.sale_price || product?.price;
  const discount = product?.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;
  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to add items to cart',
        variant: 'destructive',
      });
      onOpenChange(false);
      navigate('/auth/signin');
      return;
    }

    try {
      await addToCart.mutateAsync({
        userId: user.id,
        productId: product.id,
        quantity,
      });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to checkout',
        variant: 'destructive',
      });
      onOpenChange(false);
      navigate('/auth/signin');
      return;
    }

    // Close product modal and open checkout modal directly with this product
    onOpenChange(false);
    
    // Call onBuyNow callback with product and quantity
    setTimeout(() => {
      if (onBuyNow) {
        onBuyNow(product, quantity);
      } else if (onCheckoutOpen) {
        // Fallback if onBuyNow is not provided
        onCheckoutOpen();
      }
      setIsBuyingNow(false);
    }, 100);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {discount > 0 && (
              <Badge className="w-fit bg-red-500 text-white text-base py-1 px-3">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Title and Category */}
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2">{product.name}</h2>
              {product.categories && (
                <Badge variant="outline" className="text-sm">
                  {product.categories.name}
                </Badge>
              )}
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.round(Number(averageRating))
                          ? 'fill-tea-gold text-tea-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-2">Price</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-tea-gold">
                  ₹{salePrice?.toFixed(0)}
                </span>
                {product.sale_price && (
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.price?.toFixed(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <Badge className="bg-green-500 text-white">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 border-tea-gold text-tea-gold hover:bg-tea-gold hover:text-white"
                disabled={!product.stock}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-tea-gold hover:bg-tea-gold/90 text-white"
                disabled={!product.stock}
              >
                Buy Now
              </Button>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="p-3 bg-gray-50 border-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">
                          {review.users?.full_name || 'Anonymous'}
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? 'fill-tea-gold text-tea-gold'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

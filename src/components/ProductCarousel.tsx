import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useEcommerce';
import { useToast } from '@/components/ui/use-toast';
import { ProductModal } from './ProductModal';

interface ProductCarouselProps {
  products: Product[];
  categoryName: string;
  onCheckoutOpen?: () => void;
}

export const ProductCarousel = ({ products, categoryName, onCheckoutOpen }: ProductCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to cart',
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        userId: user.id,
        productId,
        quantity: 1,
      });
      toast({
        title: 'Added to cart',
        description: 'Item added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Products Container */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-80"
              onClick={() => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
            >
              <div className="h-full cursor-pointer transition-transform duration-300 hover:scale-105">
                <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 border-0">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl text-gray-300 mb-2">🫖</div>
                          <p className="text-gray-400 text-sm">No image available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Sale Badge */}
                    {product.sale_price && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                      </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-5 flex flex-col h-48">
                    {/* Product Name */}
                    <h4 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground leading-tight">
                      {product.name}
                    </h4>
                    
                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                    )}
                    
                    {/* Pricing */}
                    <div className="flex items-center gap-3 mb-4">
                      {product.sale_price ? (
                        <>
                          <span className="text-xs line-through text-gray-400 font-medium">
                            ₹{product.price.toFixed(0)}
                          </span>
                          <span className="text-xl font-bold text-tea-gold">
                            ₹{product.sale_price.toFixed(0)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-foreground">
                          ₹{product.price.toFixed(0)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status & Button */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <span className={`text-xs font-semibold ${
                        product.stock > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                      <Button
                        size="sm"
                        disabled={product.stock === 0 || addToCart.isPending}
                        onClick={(e) => handleAddToCart(e, product.id)}
                        className="bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold px-4 h-9 rounded-lg transition-all"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {products.length > 3 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-6 z-10 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-tea-gold/10 transition-all opacity-0 group-hover:opacity-100"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5 text-tea-gold" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 z-10 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-tea-gold/10 transition-all opacity-0 group-hover:opacity-100"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5 text-tea-gold" />
            </Button>
          </>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCheckoutOpen={onCheckoutOpen}
      />
    </div>
  );
};

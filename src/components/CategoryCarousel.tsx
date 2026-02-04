import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductModal } from '@/components/ProductModal';
import { Product } from '@/lib/supabase';

interface CategoryCarouselProps {
  categoryName: string;
  products: Product[];
  onProductSelect: (product: Product) => void;
  onCheckoutOpen?: () => void;
}

const ProductCardSmall = ({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) => {
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="group relative cursor-pointer flex-shrink-0 w-56"
      whileHover={{ y: -8 }}
      onClick={() => onSelect(product)}
    >
      <div className="relative bg-card rounded-xl overflow-hidden shadow-md border border-border/50 h-full flex flex-col">
        {/* Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}

        {/* Bestseller Badge */}
        {product.is_bestseller && (
          <div className="absolute top-3 left-3 z-10 bg-tea-gold text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ BESTSELLER
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {product.image_url ? (
            <motion.img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-tea-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-serif font-bold text-base text-foreground mb-2 line-clamp-2">
              {product.name}
            </h4>

            {product.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {product.sale_price ? (
                <>
                  <span className="text-sm line-through text-gray-400">
                    ₹{product.price.toFixed(0)}
                  </span>
                  <span className="text-lg font-bold text-tea-gold">
                    ₹{product.sale_price.toFixed(0)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-foreground">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>

            <Button 
              variant="gold-outline" 
              className="w-full text-sm py-2 h-auto group-hover:bg-tea-gold group-hover:text-tea-forest transition-all duration-300"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function CategoryCarousel({
  categoryName,
  products,
  onProductSelect,
  onCheckoutOpen,
}: CategoryCarouselProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      {/* Category Name */}
      <div className="mb-6 flex items-center justify-between">
        <motion.h3
          className="font-serif text-2xl md:text-3xl font-bold text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {categoryName}
        </motion.h3>
        
        {/* Scroll Indicators and Controls */}
        {products.length > 4 && (
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Carousel */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <ProductCardSmall
                product={product}
                onSelect={onProductSelect}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

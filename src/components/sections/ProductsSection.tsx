import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductModal } from "@/components/ProductModal";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { Product } from "@/lib/supabase";

const ProductsSection = ({ onCheckoutOpen, onBuyNow }: { onCheckoutOpen?: () => void; onBuyNow?: (product: any, quantity: number) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: { name: string; products: Product[] } } = {};
    
    categories.forEach((category) => {
      grouped[category.id] = {
        name: category.name,
        products: products.filter((p) => p.category_id === category.id),
      };
    });

    return grouped;
  }, [products, categories]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section 
      id="products" 
      className="relative py-24 md:py-32 bg-muted/30"
      ref={ref}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Collection
          </motion.p>

          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Premium <span className="text-gradient-gold">Tea Selection</span>
          </motion.h2>

          <motion.div
            className="w-24 h-0.5 mx-auto mb-8 bg-gradient-to-r from-transparent via-tea-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover our curated selection of handpicked tea leaves, 
            each blend crafted for the discerning tea enthusiast.
          </motion.p>
        </div>

        {/* Category Carousels */}
        {Object.entries(productsByCategory).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(productsByCategory).map(([categoryId, { name, products: categoryProducts }]) => 
              categoryProducts.length > 0 ? (
                <CategoryCarousel
                  key={categoryId}
                  categoryName={name}
                  products={categoryProducts}
                  onProductSelect={handleSelectProduct}
                  onCheckoutOpen={onCheckoutOpen}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No products available. Please add products in the admin panel.
            </p>
          </div>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onCheckoutOpen={onCheckoutOpen}
            onBuyNow={onBuyNow}
          />
        )}
      </div>
    </section>
  );
};

export default ProductsSection;

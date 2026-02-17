import { useParams, useNavigate } from "react-router-dom";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/lib/supabase";

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts(categoryId);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const currentCategory = categories.find((cat) => cat.id === categoryId);

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-tea-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-tea-dark mb-4">
            Category Not Found
          </h1>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-tea-gold hover:bg-tea-gold/90 text-tea-dark"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tea-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-tea-forest to-tea-dark text-tea-cream py-12 px-4">
        <div className="container mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-tea-gold hover:text-tea-cream transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {currentCategory.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6 w-full"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group h-full"
              >
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-tea-cream/20 hover:border-tea-gold/50"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-tea-cream/50 to-tea-cream/20">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-tea-cream/40">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-4 flex-1 flex flex-col">
                    <h3 className="font-serif text-sm sm:text-lg font-semibold text-tea-dark mb-1 sm:mb-2 group-hover:text-tea-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-tea-dark/60 mb-2 sm:mb-4 line-clamp-2 flex-1 hidden sm:block">
                      {product.description || "Premium tea selection"}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2 sm:mb-4">
                      <span className="text-lg sm:text-2xl font-bold text-tea-gold">
                        ₹{product.sale_price || product.price}
                      </span>
                      {product.sale_price && product.sale_price < product.price && (
                        <span className="text-xs sm:text-sm text-tea-dark/50 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      disabled={product.stock <= 0}
                      className="w-full bg-tea-gold hover:bg-tea-gold/90 text-tea-dark font-semibold mt-auto text-xs sm:text-sm py-1 sm:py-2 h-auto"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="inline-block">
              <div className="w-20 h-20 rounded-full bg-tea-cream/20 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-tea-dark/40" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-tea-dark mb-2">
                No Products Yet
              </h2>
              <p className="text-tea-dark/60 mb-8">
                This category doesn't have any products yet. Check back soon!
              </p>
              <Button
                onClick={() => navigate("/shop")}
                className="bg-tea-gold hover:bg-tea-gold/90 text-tea-dark"
              >
                Browse All Products
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

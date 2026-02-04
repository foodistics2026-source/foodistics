import { useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { ProductCarousel } from '@/components/ProductCarousel';
import { useCategories, useProducts } from '@/hooks/useProducts';

export default function Shop() {
  const { data: categories = [] } = useCategories();
  const { data: allProducts = [] } = useProducts();

  const productsByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      products: allProducts.filter((p) => p.category_id === category.id),
    }));
  }, [categories, allProducts]);

  return (
    <main className="flex flex-col h-screen bg-white">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto mt-20 mb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-tea-gold/15 via-tea-gold/10 to-transparent py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4 text-foreground">
                Our Tea Collection
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our premium selection of handpicked tea leaves from around the world
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4 space-y-20">
            {productsByCategory.map(({ category, products }, index) => (
              <div key={category.id} className="space-y-8">
                {/* Category Section */}
                <div className="border-b-2 border-tea-gold/20 pb-4">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground inline-block">
                    {category.name}
                  </h2>
                  <span className="text-sm text-muted-foreground ml-4 align-middle">
                    ({products.length} products)
                  </span>
                </div>
                
                {/* Products */}
                <ProductCarousel
                  products={products}
                  categoryName={category.name}
                />
              </div>
            ))}

            {/* Empty State */}
            {productsByCategory.every(({ products }) => products.length === 0) && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

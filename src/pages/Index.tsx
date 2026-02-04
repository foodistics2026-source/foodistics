import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import WhySection from "@/components/sections/WhySection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";

const Index = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItems, setDirectCheckoutItems] = useState<any[]>([]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection 
        onCheckoutOpen={() => setIsCheckoutOpen(true)}
        onBuyNow={(product, quantity) => {
          setDirectCheckoutItems([{ 
            product_id: product.id, 
            products: product, 
            quantity 
          }]);
          setIsCheckoutOpen(true);
        }}
      />
      <WhySection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItems([]);
        }}
        directCheckoutItems={directCheckoutItems}
      />
    </main>
  );
};

export default Index;

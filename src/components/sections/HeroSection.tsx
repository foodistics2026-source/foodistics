import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useAnimationOptimization, getAnimationDuration } from "@/hooks/useAnimationOptimization";

const FloatingLeaf = ({ delay, className, size = "w-6 h-6", isMobile = false }: { delay: number; className: string; size?: string; isMobile?: boolean }) => {
  // Disable animations on mobile, show static
  if (isMobile) {
    return (
      <div className={`absolute pointer-events-none opacity-40 ${className}`}>
        <svg viewBox="0 0 24 24" className={`${size} text-tea-cream/30`} fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C12.17,20 16,16.67 16,11C16,8 14.17,6 14.17,6C17,7 17,10 17,10C17,10 21,9 21,5C21,5 21,2 17,2C17,2 14,2 11,5C8,8 3,13 3,13C3,13 5,11 9,10C13,9 17,8 17,8Z" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0, 0.6, 0.6, 0],
        y: [20, -100, -200, -300],
        x: [0, 20, -10, 30],
        rotate: [0, 15, -10, 20]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <svg viewBox="0 0 24 24" className={`${size} text-tea-cream/30`} fill="currentColor">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C12.17,20 16,16.67 16,11C16,8 14.17,6 14.17,6C17,7 17,10 17,10C17,10 21,9 21,5C21,5 21,2 17,2C17,2 14,2 11,5C8,8 3,13 3,13C3,13 5,11 9,10C13,9 17,8 17,8Z" />
      </svg>
    </motion.div>
  );
};

const FloatingLeafAlt = ({ delay, className, size = "w-5 h-5", isMobile = false }: { delay: number; className: string; size?: string; isMobile?: boolean }) => {
  if (isMobile) {
    return (
      <div className={`absolute pointer-events-none opacity-30 ${className}`}>
        <svg viewBox="0 0 24 24" className={`${size} text-tea-gold/25`} fill="currentColor">
          <path d="M6,11A2,2 0 0,1 8,13V17H4A2,2 0 0,1 2,15V13A2,2 0 0,1 4,11H6M4,13V15H6V13H4M20,13V15H22A2,2 0 0,0 24,13V11A2,2 0 0,0 22,9H20A2,2 0 0,0 18,11V13A2,2 0 0,0 20,15M20,11H22V13H20V11M12,7A2,2 0 0,1 14,9V11H10V9A2,2 0 0,1 12,7M12,9V11M12,3A2,2 0 0,1 14,5V6H10V5A2,2 0 0,1 12,3" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0.5, 0],
        y: [0, -150, -250, -350],
        x: [0, -15, 25, -20],
        rotate: [0, -20, 15, -25]
      }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <svg viewBox="0 0 24 24" className={`${size} text-tea-gold/25`} fill="currentColor">
        <path d="M6,11A2,2 0 0,1 8,13V17H4A2,2 0 0,1 2,15V13A2,2 0 0,1 4,11H6M4,13V15H6V13H4M20,13V15H22A2,2 0 0,0 24,13V11A2,2 0 0,0 22,9H20A2,2 0 0,0 18,11V13A2,2 0 0,0 20,15M20,11H22V13H20V11M12,7A2,2 0 0,1 14,9V11H10V9A2,2 0 0,1 12,7M12,9V11M12,3A2,2 0 0,1 14,5V6H10V5A2,2 0 0,1 12,3" />
      </svg>
    </motion.div>
  );
};

const SteamLine = ({ delay, left, isMobile = false }: { delay: number; left: string; isMobile?: boolean }) => {
  if (isMobile) {
    return null; // Don't render steam lines on mobile
  }

  return (
    <motion.div
      className="absolute bottom-32 w-1 h-16 bg-gradient-to-t from-tea-cream/20 to-transparent rounded-full blur-sm"
      style={{ left, willChange: "transform, opacity" }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ 
        opacity: [0, 0.4, 0.2, 0],
        scaleY: [0, 1, 1.2, 0],
        y: [0, -40, -80, -120]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    />
  );
};

const HeroSection = () => {
  const { isMobile, shouldAnimate } = useAnimationOptimization();
  
  // On mobile, reduce animation intensity
  const leafCount = isMobile ? 5 : 13; // Fewer floating elements on mobile
  const leafAltCount = isMobile ? 3 : 8;

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-tea-forest via-tea-forest to-tea-dark grain-texture">
      {/* Animated Background Elements */}
      {shouldAnimate && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Leaves - Reduced on mobile */}
          {Array.from({ length: leafCount }).map((_, i) => (
            <FloatingLeaf 
              key={`leaf-${i}`}
              delay={i * 0.5} 
              className={`left-[${(i * 100 / leafCount) % 90}%] bottom-${[20, 24, 28, 32, 36, 40, 44, 48][i % 8]}`}
              size={["w-8 h-8", "w-5 h-5", "w-7 h-7", "w-6 h-6", "w-4 h-4"][i % 5]}
              isMobile={isMobile}
            />
          ))}
          
          {/* Alternate Leaf Style */}
          {Array.from({ length: leafAltCount }).map((_, i) => (
            <FloatingLeafAlt 
              key={`leaf-alt-${i}`}
              delay={i * 0.6 + 0.3} 
              className={`left-[${(i * 100 / leafAltCount) % 90}%] bottom-${[20, 24, 28, 32, 36, 40][i % 6]}`}
              size={["w-6 h-6", "w-5 h-5", "w-7 h-7", "w-4 h-4"][i % 4]}
              isMobile={isMobile}
            />
          ))}
          
          {/* Steam Effect - Desktop only */}
          {!isMobile && (
            <>
              <SteamLine delay={0} left="25%" />
              <SteamLine delay={0.8} left="35%" />
              <SteamLine delay={1.6} left="50%" />
              <SteamLine delay={2.4} left="65%" />
              <SteamLine delay={3.2} left="75%" />
            </>
          )}
          
          {/* Gradient Orbs - Mobile: simplified, Desktop: full */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-tea-gold/5 rounded-full blur-3xl"
            animate={ shouldAnimate ? { 
              scale: isMobile ? [1, 1.05, 1] : [1, 1.2, 1],
              opacity: isMobile ? [0.2, 0.3, 0.2] : [0.3, 0.5, 0.3]
            } : {} }
            transition={{ duration: isMobile ? 6 : 8, repeat: Infinity }}
            style={{ willChange: shouldAnimate ? "transform, opacity" : "auto" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tea-sage/5 rounded-full blur-3xl"
            animate={ shouldAnimate ? {
              scale: isMobile ? [1.05, 1, 1.05] : [1.2, 1, 1.2],
              opacity: isMobile ? [0.15, 0.25, 0.15] : [0.2, 0.4, 0.2]
            } : {} }
            transition={{ duration: isMobile ? 7 : 10, repeat: Infinity }}
            style={{ willChange: shouldAnimate ? "transform, opacity" : "auto" }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: getAnimationDuration(isMobile, 1, 0.4), ease: "easeOut" }}
        >
          {/* Tagline */}
          <motion.p
            className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: getAnimationDuration(isMobile, 0.3, 0.1), duration: getAnimationDuration(isMobile, 0.8, 0.3) }}
          >
            Premium Tea Leaves
          </motion.p>

          {/* Main Title */}
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-tea-cream mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            FOODISTICS
          </motion.h1>
          
          {/* Partnership */}
          <motion.p
            className="text-tea-cream/80 text-lg md:text-xl font-medium tracking-wide mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            partnered with <span className="text-tea-gold font-serif italic text-xl md:text-2xl">Swach Tea</span>
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-tea-cream/90 text-xl md:text-2xl font-serif italic mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Where Science Meets Tea
          </motion.p>

          {/* Divider */}
          <motion.div
            className="w-24 h-0.5 mx-auto my-8 bg-gradient-to-r from-transparent via-tea-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          />

          {/* Description */}
          <motion.p
            className="text-tea-cream/70 text-lg md:text-xl tracking-wide mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Pure &nbsp;•&nbsp; Handpicked &nbsp;•&nbsp; Naturally Processed Tea Leaves
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Button 
              variant="hero" 
              size="xl" 
              onClick={scrollToProducts}
              className="min-w-[180px]"
            >
              Explore Teas
            </Button>
            <Button 
              variant="hero-outline" 
              size="xl" 
              onClick={scrollToAbout}
              className="min-w-[180px]"
            >
              Our Story
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2, duration: 0.5 },
          y: { delay: 2, duration: 2, repeat: Infinity }
        }}
      >
        <button 
          onClick={scrollToAbout}
          className="text-tea-cream/50 hover:text-tea-gold transition-colors flex items-center justify-center"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;

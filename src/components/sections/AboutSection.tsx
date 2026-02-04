import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import teaPlantation from "@/assets/tea-plantation.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="about" 
      className="relative py-24 md:py-32 overflow-hidden bg-background"
      ref={ref}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={teaPlantation} 
          alt="Tea plantation" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Label */}
          <motion.p
            className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.p>

          {/* Main Title */}
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            About <span className="text-gradient-gold">Foodistics</span> & <span className="text-gradient-gold">Swach Tea</span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            className="w-24 h-0.5 mx-auto mb-10 bg-gradient-to-r from-transparent via-tea-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Story Text */}
          <motion.div
            className="space-y-6 text-muted-foreground text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>
              <span className="font-serif text-2xl text-foreground">Foodistics</span>, in partnership with <span className="font-serif text-xl text-tea-gold">Swach Tea</span>, is dedicated to sourcing and crafting premium tea leaves using 
              <span className="text-tea-gold font-medium"> scientific precision</span> and 
              <span className="text-tea-gold font-medium"> traditional wisdom</span>.
            </p>
            
            <p>
              Born from a passion for authentic tea experiences, we bridge the gap between 
              ancient tea cultivation practices and modern quality standards. Each leaf is 
              handpicked from the misty hills of India's finest tea gardens.
            </p>

            <p>
              Our commitment to purity means no artificial flavors, no shortcuts—just 
              the authentic taste of nature, carefully preserved from garden to cup.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { number: "15+", label: "Years of Excellence" },
              { number: "50K+", label: "Happy Customers" },
              { number: "100%", label: "Natural Leaves" },
              { number: "5", label: "Premium Blends" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

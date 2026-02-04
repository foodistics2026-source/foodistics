import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, FlaskConical, Coffee, Ban, MapPin } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural Leaves",
    description: "Pure, unprocessed tea leaves with no additives",
  },
  {
    icon: FlaskConical,
    title: "Scientifically Processed",
    description: "Modern quality control meets traditional methods",
  },
  {
    icon: Coffee,
    title: "Farm to Cup Transparency",
    description: "Full traceability from garden to your teacup",
  },
  {
    icon: Ban,
    title: "No Artificial Flavors",
    description: "Only natural taste, nothing synthetic",
  },
  {
    icon: MapPin,
    title: "Ethically Sourced from India",
    description: "Supporting local farmers and communities",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative bg-card rounded-2xl p-8 text-center border border-border/50 shadow-soft transition-all duration-500 hover:shadow-hover hover:-translate-y-2 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-tea-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <motion.div
          className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-tea-forest to-tea-dark mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-8 h-8 text-tea-cream" />
        </motion.div>

        {/* Content */}
        <h3 className="font-serif text-xl font-bold text-foreground mb-3">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Decorative Line */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-tea-gold to-transparent group-hover:w-2/3 transition-all duration-500"
        />
      </div>
    </motion.div>
  );
};

const WhySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="why" 
      className="relative py-24 md:py-32 bg-background overflow-hidden"
      ref={ref}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-tea-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-tea-forest/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Promise
          </motion.p>

          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Why <span className="text-gradient-gold">Foodistics</span> & <span className="text-gradient-gold">Swach Tea</span>?
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
            We believe in tea that's pure, honest, and crafted with care. 
            Here's what sets us apart.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;

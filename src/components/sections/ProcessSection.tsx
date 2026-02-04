import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Handpicked Tea Leaves",
    description: "Expert tea pluckers select only the finest two leaves and a bud from each plant",
  },
  {
    number: "02",
    title: "Natural Drying Process",
    description: "Leaves are carefully withered using traditional air-drying methods",
  },
  {
    number: "03",
    title: "Scientific Quality Checks",
    description: "Every batch undergoes rigorous testing for purity and flavor profile",
  },
  {
    number: "04",
    title: "Flavor Preservation",
    description: "Special processing techniques lock in natural oils and aromas",
  },
  {
    number: "05",
    title: "Packed Fresh",
    description: "Sealed in airtight packaging to preserve freshness until your cup",
  },
];

const ProcessStep = ({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex items-start gap-6"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Number Circle */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-tea-gold to-secondary flex items-center justify-center shadow-gold"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: "spring" }}
        >
          <span className="font-serif text-xl font-bold text-tea-forest">
            {step.number}
          </span>
        </motion.div>
        
        {/* Connecting Line */}
        {!isLast && (
          <motion.div
            className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-tea-gold to-border"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-16">
        <motion.h3
          className="font-serif text-xl md:text-2xl font-bold text-tea-gold mb-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
        >
          {step.title}
        </motion.h3>
        <motion.p
          className="text-gray-100 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
        >
          {step.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section 
      id="process" 
      className="relative py-24 md:py-32 bg-tea-forest overflow-hidden grain-texture"
      ref={ref}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-tea-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-tea-cream/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-24">
            <motion.p
              className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              The Journey
            </motion.p>

            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-tea-cream mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              How It's <span className="gold-shimmer">Made</span>
            </motion.h2>

            <motion.div
              className="w-24 h-0.5 mb-8 bg-gradient-to-r from-tea-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
            />

            <motion.p
              className="text-gray-100 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              From the misty hills of India's finest tea gardens to your cup, 
              every step is carefully orchestrated to deliver perfection.
            </motion.p>
          </div>

          {/* Right Column - Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <ProcessStep 
                key={step.number} 
                step={step} 
                index={index} 
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

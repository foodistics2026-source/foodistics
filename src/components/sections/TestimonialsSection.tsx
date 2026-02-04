import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "The Assam Black Tea from Foodistics has completely transformed my morning ritual. The depth of flavor is unmatched. Finally, a tea that lives up to its premium promise.",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    text: "As a café owner, quality is everything. Foodistics' Premium Gold Blend has become our signature offering. Customers keep coming back for that unique, luxurious taste.",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Sarah Williams",
    location: "London, UK",
    rating: 5,
    text: "I've tried countless green teas, but nothing compares to the freshness and purity of Foodistics. You can truly taste the difference that ethical sourcing makes.",
    avatar: "SW",
  },
  {
    id: 4,
    name: "Rajesh Patel",
    location: "Delhi, India",
    rating: 5,
    text: "The Masala Chai brings back memories of my grandmother's kitchen. Authentic spices, perfect balance, and that warm feeling of home in every cup.",
    avatar: "RP",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      id="testimonials" 
      className="relative py-24 md:py-32 bg-muted/30 overflow-hidden"
      ref={ref}
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-tea-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-tea-forest/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-tea-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Testimonials
          </motion.p>

          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Loved by <span className="text-gradient-gold">Tea Enthusiasts</span>
          </motion.h2>

          <motion.div
            className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-tea-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Quote Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-tea-gold/20">
              <Quote className="w-16 h-16" />
            </div>

            {/* Testimonial Card */}
            <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-tea-gold text-tea-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-foreground text-center leading-relaxed mb-8 font-serif italic">
                  "{testimonials[activeIndex].text}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tea-gold to-secondary flex items-center justify-center text-tea-forest font-bold">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full border border-border hover:bg-tea-gold hover:text-tea-forest hover:border-tea-gold"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "w-8 bg-tea-gold" 
                        : "bg-border hover:bg-tea-gold/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full border border-border hover:bg-tea-gold hover:text-tea-forest hover:border-tea-gold"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

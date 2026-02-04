import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  const quickLinks = [
    { label: "Our Teas", href: "#products" },
    { label: "About Us", href: "#about" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#cta" },
  ];

  const teaLinks = [
    { label: "Assam Black Tea", href: "#products" },
    { label: "Green Tea", href: "#products" },
    { label: "Herbal Tea", href: "#products" },
    { label: "Masala Chai", href: "#products" },
    { label: "Premium Gold Blend", href: "#products" },
  ];

  return (
    <footer className="relative bg-tea-dark text-tea-cream/80 overflow-hidden">
      {/* Top Border Gradient */}
      <div className="h-1 bg-gradient-to-r from-tea-forest via-tea-gold to-tea-forest" />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-3xl font-bold text-tea-cream mb-2">
                FOODISTICS
              </h3>
              <p className="text-tea-gold text-sm mb-4">partnered with Swach Tea</p>
              <p className="text-tea-cream/60 text-sm leading-relaxed mb-6">
                Where Science Meets Tea. Crafting premium tea experiences 
                through scientific precision and traditional wisdom.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-tea-cream/20 flex items-center justify-center hover:bg-tea-gold hover:border-tea-gold hover:text-tea-forest transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-serif text-lg font-semibold text-tea-cream mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-tea-cream/60 hover:text-tea-gold transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Our Teas */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-serif text-lg font-semibold text-tea-cream mb-6">
                Our Teas
              </h4>
              <ul className="space-y-3">
                {teaLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-tea-cream/60 hover:text-tea-gold transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-serif text-lg font-semibold text-tea-cream mb-6">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-tea-gold flex-shrink-0" />
                  <span className="text-tea-cream/60 text-sm">
                    Tea Estate Road, Assam<br />India - 786001
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-tea-gold flex-shrink-0" />
                  <a 
                    href="mailto:hello@foodistics.com" 
                    className="text-tea-cream/60 hover:text-tea-gold transition-colors text-sm"
                  >
                    hello@foodistics.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-tea-gold flex-shrink-0" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-tea-cream/60 hover:text-tea-gold transition-colors text-sm"
                  >
                    +91 98765 43210
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-8 pt-6 border-t border-tea-cream/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-tea-cream/40 text-sm">
              © {currentYear} Foodistics partnered with Swach Tea – Premium Tea Leaves Company. All rights reserved.
            </p>
            <div className="flex gap-6 text-tea-cream/40 text-sm">
              <a href="#" className="hover:text-tea-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-tea-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
  const phoneNumber = "917602245644";
  const message = "Hi, I'm interested in your products. Please tell me more!";

  const handleOpenWhatsApp = () => {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenWhatsApp}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-300"
          aria-label="Open WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      </AnimatePresence>
    </>
  );
}

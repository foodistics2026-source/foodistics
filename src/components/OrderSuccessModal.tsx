import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderSuccessModalProps {
  orderId: string;
  totalAmount: number;
  itemCount: number;
  onClose: () => void;
}

// Falling Leaf Component
const FallingLeaf = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 1, rotate: 0 }}
      animate={{
        y: 500,
        opacity: 0,
        rotate: 360,
        x: [0, Math.random() * 100 - 50, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        x: { duration: duration * 0.3, repeat: Infinity },
      }}
      className="absolute pointer-events-none"
      style={{ left }}
    >
      <div
        className="text-green-500 opacity-70"
        style={{ fontSize: `${size}px` }}
      >
        🍂
      </div>
    </motion.div>
  );
};

export function OrderSuccessModal({
  orderId,
  totalAmount,
  itemCount,
  onClose,
}: OrderSuccessModalProps) {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  // Generate leaves with random positions
  const leaves = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    delay: i * 0.15,
    duration: 3 + Math.random() * 1.5,
    left: `${Math.random() * 100}%`,
    size: 20 + Math.random() * 15,
  }));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-lg text-center border-0 shadow-2xl overflow-hidden">
        {/* Falling Leaves Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {leaves.map((leaf) => (
            <FallingLeaf
              key={leaf.id}
              delay={leaf.delay}
              duration={leaf.duration}
              left={leaf.left}
              size={leaf.size}
            />
          ))}
        </div>

        <motion.div 
          className="space-y-5 py-6 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Success Icon with Animation */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">Order Confirmed!</h2>
            <p className="text-sm text-gray-600">
              Your order has been received successfully.
            </p>
          </motion.div>

          {/* Order Details - Compact */}
          <motion.div 
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 space-y-3 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <p className="text-gray-600">Order ID</p>
              <p className="font-bold text-tea-gold">{orderId.substring(0, 8).toUpperCase()}</p>
            </div>

            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <p className="text-gray-600">Amount</p>
              <p className="font-bold text-tea-gold text-base">₹{totalAmount.toFixed(0)}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600">Items</p>
              <p className="font-semibold text-gray-900">{itemCount}</p>
            </div>
          </motion.div>

          {/* Confirmation Call Message */}
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-semibold text-blue-900 mb-1">Confirmation Call Coming</p>
                <p className="text-xs text-blue-700">
                  Our team will call you within 24 hours to confirm your order before shipping.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex flex-col gap-2 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onClose}
              className="bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold py-5 text-sm rounded-lg"
            >
              Continue Shopping
            </Button>
          </motion.div>

          {/* Footer Message */}
          <motion.p 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            🍵 Thank you for choosing Foodistics!
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

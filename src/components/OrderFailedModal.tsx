import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderFailedModalProps {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}

export function OrderFailedModal({ error, onRetry, onClose }: OrderFailedModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-lg text-center border-0 shadow-2xl">
        <motion.div 
          className="space-y-4 py-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Error Icon with Animation */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            <div className="bg-red-100 rounded-full p-3">
              <motion.div
                animate={{ x: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AlertCircle className="w-12 h-12 text-red-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">Order Failed</h2>
            <p className="text-sm text-gray-600">
              We couldn't process your order. Please try again.
            </p>
          </motion.div>

          {/* Error Details */}
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-red-700 font-medium">{error}</p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex flex-col gap-2 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onRetry}
              className="bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold py-5 text-sm rounded-lg"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 font-semibold py-5 text-sm"
            >
              Back to Cart
            </Button>
          </motion.div>

          {/* Support Message */}
          <motion.p 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Need help? Contact support
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

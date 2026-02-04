import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  useCartItems,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useCreateOrder,
  useClearCart,
  useCreatePayment,
  useShippingMethods,
} from '@/hooks/useEcommerce';
import { useToast } from '@/hooks/use-toast';
import { OrderSuccessModal } from './OrderSuccessModal';
import { OrderFailedModal } from './OrderFailedModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directCheckoutItems?: any[];
}

type CheckoutStep = 'address' | 'shipping' | 'review' | 'success' | 'failed';

export function CheckoutModal({ isOpen, onClose, directCheckoutItems = [] }: CheckoutModalProps) {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { data: cartItems = [] } = useCartItems(user?.id || '');
  const { data: addresses = [] } = useAddresses(user?.id || '');
  const { data: shippingMethods = [] } = useShippingMethods();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();
  const createPayment = useCreatePayment();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [loading, setLoading] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    full_name: userProfile?.full_name || '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [successData, setSuccessData] = useState<any>(null);
  const [failedData, setFailedData] = useState<any>(null);

  // Update full_name whenever userProfile changes
  useEffect(() => {
    if (userProfile?.full_name) {
      setNewAddress((prev) => ({
        ...prev,
        full_name: userProfile.full_name,
      }));
    }
  }, [userProfile?.full_name]);

  // Capture checkout items when modal opens (independent of cart)
  // If directCheckoutItems are provided (from Buy Now), use those
  // Otherwise, use cartItems
  useEffect(() => {
    if (isOpen) {
      if (directCheckoutItems.length > 0) {
        setCheckoutItems([...directCheckoutItems]);
      } else if (cartItems.length > 0) {
        setCheckoutItems([...cartItems]);
      } else {
        setCheckoutItems([]);
      }
    }
  }, [isOpen, directCheckoutItems, cartItems]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedShippingAddress) {
      setSelectedShippingAddress(addresses[0].id);
    }
  }, [addresses, selectedShippingAddress]);

  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedShippingMethod]);

  const cartTotal = useMemo(() => {
    return checkoutItems.reduce((total, item) => {
      const product = item.products;
      const price = product?.sale_price || product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [checkoutItems]);

  const shippingCost = useMemo(() => {
    if (!selectedShippingMethod) return 0;
    const method = shippingMethods.find((m) => m.id === selectedShippingMethod);
    return method?.rate || 0;
  }, [selectedShippingMethod, shippingMethods]);

  const totalAmount = cartTotal + shippingCost;

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const result = await createAddress.mutateAsync({
        user_id: user.id,
        full_name: newAddress.full_name,
        phone: newAddress.phone,
        street_address: newAddress.street_address,
        street_address2: '',
        city: newAddress.city,
        state: newAddress.state,
        postal_code: newAddress.postal_code,
        country: 'India',
        type: 'shipping',
        is_default: addresses.length === 0,
      });

      setSelectedShippingAddress(result.id);
      setShowAddressForm(false);
      setNewAddress({
        full_name: userProfile?.full_name || '',
        phone: '',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
      });
      
      // Auto-advance to next step after 500ms
      setTimeout(() => {
        setStep('shipping');
        setLoading(false);
      }, 500);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add address',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAddress = async (addressId: string) => {
    setSelectedShippingAddress(addressId);
    
    // Update all other addresses to not be default
    try {
      const otherAddresses = addresses.filter(a => a.id !== addressId);
      for (const addr of otherAddresses) {
        if (addr.is_default) {
          await updateAddress.mutateAsync({
            ...addr,
            is_default: false,
          });
        }
      }
      
      // Make the selected address default
      const selectedAddr = addresses.find(a => a.id === addressId);
      if (selectedAddr && !selectedAddr.is_default) {
        await updateAddress.mutateAsync({
          ...selectedAddr,
          is_default: true,
        });
      }
    } catch (error: any) {
      // Error updating address, continue with checkout
    }
    
    setTimeout(() => setStep('shipping'), 500);
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedShippingAddress) {
      toast({
        title: 'Error',
        description: 'Please select shipping address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const orderNumber = `ORD-${Date.now()}`;

      const itemsToCreate = checkoutItems.map((item) => {
        // Get product name from various possible locations
        const productName = 
          item.products?.name || 
          item.product_name || 
          'Unknown Product';
        
        return {
          product_id: item.product_id,
          product_name: productName,
          quantity: item.quantity,
          price_at_purchase: item.products?.price || item.price_at_purchase || 0,
          sale_price_at_purchase: item.products?.sale_price || item.sale_price_at_purchase || undefined,
        };
      });

      const order = await createOrder.mutateAsync({
        user_id: user.id,
        order_number: orderNumber,
        subtotal: cartTotal,
        tax_amount: 0,
        shipping_amount: shippingCost,
        total_amount: totalAmount,
        billing_address_id: selectedShippingAddress,
        shipping_address_id: selectedShippingAddress,
        items: itemsToCreate,
      });

      await createPayment.mutateAsync({
        order_id: order.id,
        amount: totalAmount,
        payment_method: 'cod',
      });

      await clearCart.mutateAsync(user.id);

      setSuccessData({
        orderId: order.id,
        orderNumber: orderNumber,
        totalAmount,
        itemCount: checkoutItems.length,
      });

      setStep('success');
    } catch (error: any) {
      setFailedData({
        error: error.message || 'Failed to place order',
      });
      setStep('failed');
    } finally {
      setLoading(false);
    }
  };

  const steps: CheckoutStep[] = ['address', 'shipping', 'review'];
  const currentStepIndex = steps.indexOf(step as CheckoutStep);

  return (
    <>
      <Dialog open={isOpen && step !== 'success' && step !== 'failed'} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">Checkout</DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4 sm:mb-8 gap-1 sm:gap-2">
            {steps.map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: idx <= currentStepIndex ? '#D4A574' : '#f0f0f0',
                    color: idx <= currentStepIndex ? 'white' : '#666',
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base"
                >
                  {idx < currentStepIndex ? <Check size={20} /> : <span>{idx + 1}</span>}
                </motion.div>
                <div className="ml-3">
                  <p className="text-sm font-semibold capitalize">{s}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${idx < currentStepIndex ? 'bg-tea-gold' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Address Step */}
            {step === 'address' && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-xl font-bold">Select Delivery Address</h2>

                  {addresses.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      {addresses.map((address) => (
                        <motion.label
                          key={address.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={address.id}
                            checked={selectedShippingAddress === address.id}
                            onChange={(e) => handleSelectAddress(e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <p className="font-semibold">{address.full_name}</p>
                            <p className="text-sm text-gray-600">{address.street_address}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="w-full"
                  >
                    {showAddressForm ? 'Cancel' : 'Add New Address'}
                  </Button>

                  {selectedShippingAddress && !showAddressForm && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => setStep('shipping')}
                        className="w-full bg-tea-gold hover:bg-tea-gold/90"
                      >
                        Continue to Shipping
                      </Button>
                    </motion.div>
                  )}

                  {showAddressForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateAddress}
                      className="space-y-3"
                    >
                      <Input
                        placeholder="Full Name"
                        value={newAddress.full_name || userProfile?.full_name || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Street Address"
                        value={newAddress.street_address}
                        onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                        <Input
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          required
                        />
                      </div>
                      <Input
                        placeholder="Postal Code"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        required
                      />
                      <Button type="submit" className="w-full bg-tea-gold hover:bg-tea-gold/90">
                        Save & Continue
                      </Button>
                    </motion.form>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Shipping Step */}
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-xl font-bold">Select Shipping Method</h2>

                  {shippingMethods.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {shippingMethods.map((method) => (
                        <motion.label
                          key={method.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="shipping-method"
                            value={method.id}
                            checked={selectedShippingMethod === method.id}
                            onChange={(e) => {
                              setSelectedShippingMethod(e.target.value);
                              setTimeout(() => setStep('review'), 500);
                            }}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{method.name}</p>
                            {method.description && (
                              <p className="text-sm text-gray-600">{method.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-tea-gold">₹{method.rate}</p>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No shipping methods available</p>
                  )}

                  {selectedShippingMethod && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => setStep('review')}
                        className="w-full bg-tea-gold hover:bg-tea-gold/90"
                      >
                        Continue to Review
                      </Button>
                    </motion.div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setStep('address')}
                    className="w-full"
                  >
                    Back to Address
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-xl font-bold">Order Review</h2>

                  {/* Address Summary */}
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Delivery Address</p>
                    {addresses.find((a) => a.id === selectedShippingAddress) && (
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
                        <p className="font-semibold">
                          {addresses.find((a) => a.id === selectedShippingAddress)?.full_name}
                        </p>
                        <p className="text-gray-600">
                          {addresses.find((a) => a.id === selectedShippingAddress)?.street_address}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Shipping Method Summary */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Shipping Method</p>
                    <Badge className="bg-tea-gold/20 text-tea-gold border-0">
                      {shippingMethods.find((m) => m.id === selectedShippingMethod)?.name}
                    </Badge>
                  </div>

                  {/* Items in Order */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Items</p>
                    <div className="space-y-3">
                      {checkoutItems.length > 0 ? (
                        checkoutItems.map((item, index) => (
                          <motion.div
                            key={`${item.product_id || item.id || index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.products?.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">₹{((item.products?.sale_price || item.products?.price || 0) * item.quantity).toFixed(0)}</p>
                              <p className="text-xs text-gray-600">₹{(item.products?.sale_price || item.products?.price || 0).toFixed(0)} each</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No items in checkout</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Order Summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{shippingCost.toFixed(0)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-tea-gold">₹{totalAmount.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Payment Method:</strong> Cash on Delivery (COD)
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <motion.div 
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="flex-1 bg-tea-gold hover:bg-tea-gold/90"
                      >
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {successData && step === 'success' && (
        <OrderSuccessModal
          orderId={successData.orderId}
          totalAmount={successData.totalAmount}
          itemCount={successData.itemCount}
          onClose={() => {
            setSuccessData(null);
            setStep('address');
            onClose();
          }}
        />
      )}

      {/* Failed Modal */}
      {failedData && step === 'failed' && (
        <OrderFailedModal
          error={failedData.error}
          onRetry={() => {
            setFailedData(null);
            setStep('review');
          }}
          onClose={() => {
            setFailedData(null);
            setStep('address');
            onClose();
          }}
        />
      )}
    </>
  );
}

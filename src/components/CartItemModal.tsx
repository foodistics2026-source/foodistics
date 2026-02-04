import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRemoveFromCart } from '@/hooks/useEcommerce';
import { useToast } from '@/components/ui/use-toast';

interface CartItemModalProps {
  cartItemId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CartItemModal({
  cartItemId,
  productName,
  open,
  onOpenChange,
  onSuccess,
}: CartItemModalProps) {
  const removeFromCart = useRemoveFromCart();
  const { toast } = useToast();

  const handleRemove = async () => {
    try {
      await removeFromCart.mutateAsync(cartItemId);
      toast({
        title: 'Removed from cart',
        description: `${productName} has been removed from your cart`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove from cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] sm:max-w-sm rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from Cart?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{productName}</strong> from your cart? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={removeFromCart.isPending}
          >
            {removeFromCart.isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

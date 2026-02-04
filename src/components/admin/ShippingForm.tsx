import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useShippingMethods, useCreateShippingMethod, useUpdateShippingMethod, useDeleteShippingMethod } from '@/hooks/useEcommerce';
import { Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShippingFormProps {
  onSuccess: () => void;
  initialData?: { id: string; name: string; rate: number; description?: string } | null;
  onEdit?: () => void;
}

export function ShippingForm({ onSuccess, initialData, onEdit }: ShippingFormProps) {
  const { toast } = useToast();
  const createShippingMethod = useCreateShippingMethod();
  const updateShippingMethod = useUpdateShippingMethod();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    rate: initialData?.rate || 0,
    description: initialData?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData) {
        await updateShippingMethod.mutateAsync({
          id: initialData.id,
          ...formData,
        });
        toast({
          title: 'Success',
          description: 'Shipping method updated',
        });
      } else {
        await createShippingMethod.mutateAsync(formData);
        toast({
          title: 'Success',
          description: 'Shipping method created',
        });
        setFormData({ name: '', rate: 0, description: '' });
      }
      onSuccess();
      if (onEdit) onEdit();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save shipping method',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Shipping Method Name</label>
        <Input
          placeholder="e.g., Standard Shipping"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Shipping Rate (₹)</label>
        <Input
          type="number"
          placeholder="50"
          value={formData.rate}
          onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description (Optional)</label>
        <Input
          placeholder="e.g., Delivery in 3-5 business days"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full bg-tea-gold hover:bg-tea-gold/90">
        {initialData ? 'Update Method' : 'Create Method'}
      </Button>
    </form>
  );
}

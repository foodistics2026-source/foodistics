import { useState } from 'react';
import { useShippingMethods, useDeleteShippingMethod } from '@/hooks/useEcommerce';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ShippingForm } from './ShippingForm';

export function ShippingTable() {
  const { data: shippingMethods = [] } = useShippingMethods();
  const deleteShippingMethod = useDeleteShippingMethod();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping method?')) return;

    try {
      await deleteShippingMethod.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Shipping method deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete shipping method',
        variant: 'destructive',
      });
    }
  };

  if (shippingMethods.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No shipping methods created yet</p>
      </Card>
    );
  }

  const editingMethod = editingId ? shippingMethods.find((m) => m.id === editingId) : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {shippingMethods.map((method) => (
          <Card key={method.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{method.name}</h3>
                {method.description && (
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                )}
                <p className="text-lg font-bold text-tea-gold mt-1">₹{method.rate}</p>
              </div>

              <div className="flex gap-2">
                <Dialog open={editDialogOpen && editingId === method.id} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(method.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Shipping Method</DialogTitle>
                    </DialogHeader>
                    {editingMethod && (
                      <ShippingForm
                        initialData={editingMethod}
                        onSuccess={() => {
                          setEditDialogOpen(false);
                          setEditingId(null);
                        }}
                        onEdit={() => {
                          setEditDialogOpen(false);
                          setEditingId(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

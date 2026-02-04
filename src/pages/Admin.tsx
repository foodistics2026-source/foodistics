import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { ShippingTable } from '@/components/admin/ShippingTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { ShippingForm } from '@/components/admin/ShippingForm';
import OrderAnalytics from './admin/OrderAnalytics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Admin() {
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, categories, shipping, and orders</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-tea-gold hover:bg-tea-gold/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] rounded-lg p-4 sm:p-6 flex flex-col">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <ProductForm onSuccess={() => setProductDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <ProductsTable />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-tea-gold hover:bg-tea-gold/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <CategoryForm onSuccess={() => setCategoryDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <CategoriesTable />
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-tea-gold hover:bg-tea-gold/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Shipping Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Shipping Method</DialogTitle>
                  </DialogHeader>
                  <ShippingForm onSuccess={() => setShippingDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <ShippingTable />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <OrdersTable />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <OrderAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

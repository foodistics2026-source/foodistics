import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useProducts, useDeleteProduct, useCategories } from '@/hooks/useProducts';
import { ProductForm } from './ProductForm';
import { useToast } from '@/components/ui/use-toast';

export const ProductsTable = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group products by category
  const groupedProducts = categories.map((category) => ({
    category,
    products: products.filter((p) => p.category_id === category.id),
  }));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        {groupedProducts.map(({ category, products: categoryProducts }) => (
          <div key={category.id} className="border-b last:border-b-0">
            {/* Category Header */}
            <div className="bg-gray-50 p-2 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
              onClick={() => toggleCategory(category.id)}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {expandedCategories.has(category.id) ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-tea-gold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-tea-gold flex-shrink-0" />
                )}
                <h3 className="font-semibold text-sm sm:text-lg truncate">{category.name}</h3>
                <span className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-1 rounded whitespace-nowrap">
                  {categoryProducts.length}
                </span>
              </div>
            </div>

            {/* Products Table */}
            {expandedCategories.has(category.id) && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs sm:text-sm">Image</TableHead>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Price</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Sale Price</TableHead>
                      <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Best</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="p-2 sm:p-4">
                          <img
                            src={product.image_url || 'placeholder.svg'}
                            alt={product.name}
                            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'placeholder.svg';
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 max-w-[120px] truncate">{product.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4">₹{product.price.toFixed(0)}</TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell">
                          {product.sale_price ? `₹${product.sale_price.toFixed(0)}` : '-'}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `${product.stock}` : 'Out'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 hidden md:table-cell">
                          {product.is_bestseller ? (
                            <Badge className="bg-tea-gold text-white text-xs gap-1">
                              <Star className="h-2 w-2 fill-current" />
                              Yes
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                      <TableCell className="space-x-2 p-2 sm:p-4">
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs h-7"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Pencil className="h-3 w-3" />
                              <span className="hidden sm:inline ml-1">Edit</span>
                            </Button>
                          </DialogTrigger>
                          {editingProduct && (
                            <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] rounded-lg p-4 sm:p-6 flex flex-col">
                              <DialogHeader className="flex-shrink-0">
                                <DialogTitle className="text-lg">Edit Product</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto scrollbar-hide">
                                <ProductForm
                                  product={editingProduct}
                                  onSuccess={() => setEditDialogOpen(false)}
                                />
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs h-7"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {groupedProducts.every(({ products }) => products.length === 0) && (
          <div className="p-4 sm:p-8 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">Create a category and add products to get started</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

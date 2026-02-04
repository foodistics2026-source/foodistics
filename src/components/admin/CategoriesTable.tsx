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
import { Pencil, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '@/hooks/useProducts';
import { CategoryForm } from './CategoryForm';
import { useToast } from '@/components/ui/use-toast';

export const CategoriesTable = () => {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="border rounded-lg p-4 sm:p-8 text-center">
        <p className="text-gray-500 text-sm sm:text-lg">No categories found</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">Create your first category to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-xs sm:text-sm">Name</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Created</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-sm sm:text-base p-2 sm:p-4 max-w-[150px] truncate">{category.name}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden sm:table-cell p-2 sm:p-4">
                  {new Date(category.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="space-x-1 sm:space-x-2 p-2 sm:p-4">
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs h-7"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="hidden sm:inline ml-1">Edit</span>
                      </Button>
                    </DialogTrigger>
                    {editingCategory && (
                      <DialogContent className="w-[95vw] sm:max-w-md rounded-lg p-3 sm:p-6">
                        <DialogHeader>
                          <DialogTitle className="text-lg">Edit Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                          category={editingCategory}
                          onSuccess={() => setEditDialogOpen(false)}
                        />
                      </DialogContent>
                    )}
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs h-7"
                    onClick={() => setDeleteId(category.id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category? This action cannot be undone.
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

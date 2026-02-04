import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useProducts';
import { Category } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(50, 'Category name must be less than 50 characters'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
    } : {
      name: '',
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      if (category?.id) {
        // Update existing category
        await updateCategory.mutateAsync({ 
          id: category.id,
          name: values.name,
          description: category.description,
          image_url: category.image_url,
          created_at: category.created_at,
        } as Category);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        // Create new category - only send name
        await createCategory.mutateAsync({
          name: values.name,
        } as any);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Category submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Black Tea, Green Tea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-tea-gold hover:bg-tea-gold/90"
          disabled={createCategory.isPending || updateCategory.isPending}
        >
          {category?.id ? 'Update Category' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
};

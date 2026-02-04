import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  sale_price: z.coerce.number().optional(),
  image_url: z.string().min(1, 'Please upload a product image'),
  stock: z.coerce.number().min(0, 'Stock must be 0 or greater'),
  is_bestseller: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      category_id: '',
      description: '',
      price: 0,
      sale_price: undefined,
      image_url: '',
      stock: 0,
      is_bestseller: false,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      if (product) {
        await updateProduct.mutateAsync({
          ...product,
          ...values,
        });
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await createProduct.mutateAsync(values as any);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Product submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Product Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Assam Black Tea" 
                  className="rounded-lg border-gray-200"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg">
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description..."
                  className="resize-none rounded-lg border-gray-200 min-h-[60px]"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price & Sale Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="rounded-lg border-gray-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Sale Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="rounded-lg border-gray-200"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-xs mt-1">Leave empty if not on sale</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Product Image</FormLabel>
              <FormControl>
                <div className="rounded-lg border border-gray-200 p-3">
                  <ImageUpload
                    onImageUpload={field.onChange}
                    currentImage={field.value}
                    disabled={createProduct.isPending || updateProduct.isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Stock Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="rounded-lg border-gray-200"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bestseller */}
        <FormField
          control={form.control}
          name="is_bestseller"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium">Mark as Bestseller</FormLabel>
                <FormDescription className="text-xs">Show this product as a bestseller on the product page</FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-tea-gold hover:bg-tea-gold/90 text-white font-semibold rounded-lg py-2 transition-colors text-sm"
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {createProduct.isPending || updateProduct.isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </form>
    </Form>
  );
};

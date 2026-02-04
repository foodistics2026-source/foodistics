import { supabase } from '@/lib/supabase';

export async function uploadProductImage(
  file: File,
  productName: string
): Promise<string> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 5MB');
  }

  // Create unique file name
  const timestamp = Date.now();
  const sanitizedName = productName.toLowerCase().replace(/\s+/g, '-');
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${sanitizedName}-${timestamp}.${fileExtension}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`products/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrl } = supabase.storage
    .from('product-images')
    .getPublicUrl(`products/${fileName}`);

  return publicUrl.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Failed to delete image:', error.message);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed',
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image must be smaller than 5MB',
    };
  }

  return { valid: true };
}

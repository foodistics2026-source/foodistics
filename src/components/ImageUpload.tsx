import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadProductImage, validateImageFile } from '@/lib/imageUpload';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  onImageUpload,
  currentImage,
  disabled,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImage || null
  );
  const { toast } = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: 'Invalid image',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    try {
      const productName = (
        document.querySelector('input[placeholder="e.g., Assam Black Tea"]') as
          | HTMLInputElement
          | undefined
      )?.value || 'product';

      const imageUrl = await uploadProductImage(file, productName);
      onImageUpload(imageUrl);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
      // Reset preview on error
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Image</label>
        <span className="text-xs text-gray-500">
          Max 5MB (JPEG, PNG, WebP, GIF)
        </span>
      </div>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-tea-gold/20"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-64 border-2 border-dashed border-tea-gold/30 rounded-lg cursor-pointer hover:border-tea-gold/60 transition-colors bg-tea-gold/5">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="animate-spin text-tea-gold mb-2" size={32} />
            ) : (
              <>
                <Upload className="text-tea-gold mb-2" size={32} />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, WebP or GIF (max 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || disabled}
          />
        </label>
      )}
    </div>
  );
};

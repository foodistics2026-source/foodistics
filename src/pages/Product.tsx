import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useAddToCart } from "@/hooks/useEcommerce";
import { useToast } from "@/components/ui/use-toast";
import { Star, Minus, Plus, ArrowLeft } from "lucide-react";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories(id, name)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, users(full_name)")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["relatedProducts", product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .neq("id", id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product?.category_id,
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please sign in to add items to cart" });
      navigate("/auth/signin");
      return;
    }

    try {
      await addToCart.mutateAsync({
        userId: user.id,
        productId: id!,
        quantity,
      });
      setQuantity(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (productLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20 mb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tea-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20 mb-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Product not found</p>
            <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const salePrice = product.sale_price || product.price;
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;
  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 overflow-y-auto mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-tea-gold mb-8 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500">No image available</div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Category: {product.categories?.name || "Uncategorized"}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(Number(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-tea-gold">
                  ₹{salePrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <Badge className="bg-red-500">{discount}% OFF</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge className="bg-green-500">In Stock ({product.stock})</Badge>
              ) : (
                <Badge className="bg-red-500">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 py-2 text-center w-12">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 hover:bg-gray-100 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
              className="w-full bg-tea-gold hover:bg-amber-700 text-white py-6 text-lg mb-4"
            >
              {addToCart.isPending ? "Adding to cart..." : "Add to Cart"}
            </Button>

            {/* Additional Info */}
            <div className="border-t pt-6 mt-6 text-sm text-gray-600">
              <p className="mb-2">
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Category:</strong> {product.categories?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <Card key={review.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {review.users?.full_name || "Anonymous"}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="bg-gray-100 h-40 flex items-center justify-center">
                    {relatedProduct.image_url ? (
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-tea-gold font-bold">
                      ₹{(relatedProduct.sale_price || relatedProduct.price).toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

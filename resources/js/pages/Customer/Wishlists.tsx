import { Link, router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/customer-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils/helper';
import { useCart } from 'react-use-cart';

interface ProductImage {
    id: number;
    image_path: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    image?: string;
    images?: ProductImage[];
    price: number;
    description?: string;
    discount?: number;
    discount_type?: 'percentage' | 'fixed';
    stock?: number;
}

interface Wishlist {
    id: number;
    product: Product;
    created_at: string;
}

interface Props {
    wishlists: Wishlist[];
}

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price: number, discount?: number, discountType?: string): number => {
    if (!discount || discount === 0) return price;
    if (discountType === 'percentage') {
        return price - (price * (discount / 100));
    }
    return price - discount;
};

// Helper function to format price display with discount
const formatPriceWithDiscount = (price: number, discount?: number, discountType?: string) => {
    if (!discount || discount === 0) return formatPrice(price);

    const discountedPrice = calculateDiscountedPrice(price, discount, discountType);
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through text-sm">{formatPrice(price)}</span>
            <span className="text-green-600 font-semibold">{formatPrice(discountedPrice)}</span>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
                {discountType === 'percentage' ? `${Math.round(discount)}% off` : `Save ${formatPrice(discount)}`}
            </span>
        </div>
    );
};

export default function Wishlist({ wishlists }: Props) {
    const { addItem, items, updateItemQuantity } = useCart();

    const getMainImage = (product: Product) => {
        const primaryImage = product.images?.find(img => img.is_primary);
        return primaryImage ? primaryImage.image_path : product.image;
    };

    const handleAddToCart = (product: Product) => {
        const currentStock = product.stock || 0;
        if (currentStock === 0) {
            return;
        }

        const productId = String(product.id);
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount, product.discount_type);

        if (items.some((item) => item.id === productId)) {
            const existingItem = items.find((item) => item.id === productId);
            const newQuantity = Number(existingItem?.quantity) + 1;
            if (newQuantity > currentStock) {
                return;
            }
            updateItemQuantity(productId, newQuantity);
        } else {
            addItem(
                {
                    ...product,
                    id: productId,
                    price: discountedPrice,
                    originalPrice: product.price,
                    stock: product.stock
                },
                1,
            );
        }
    };

    const handleRemove = async (wishlistId: number, productId: number) => {
        if (window.confirm('Remove this item from wishlist?')) {
            try {
                // Get CSRF token from meta tag
                const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch(`/api/wishlist/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': token || '',
                    },
                });

                if (response.ok) {
                    // Refresh the page to show updated wishlist
                    router.reload();
                } else {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    alert('Failed to remove from wishlist. Please try again.');
                }
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                alert('Error removing from wishlist. Please try again.');
            }
        }
    };

    return (
        <CustomerLayout title="My Wishlist">

            <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
                {/* Back Link */}
                <Link href="/customer/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-6">
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-gray-600">Items you want to purchase later</p>
                </div>

                {/* Wishlist Items */}
                {wishlists.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wishlists.map((item) => (
                            <Card key={item.id} className="overflow-hidden flex flex-col">
                                {/* Product Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img
                                        src={`/storage/${getMainImage(item.product)}`}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemove(item.id, item.product.id)}
                                        className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-500 shadow-md transition-colors hover:bg-red-50"
                                    >
                                        <Heart className="h-4 w-4 fill-current" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <CardContent className="pt-4 flex-1 flex flex-col">
                                    <Link href={`/products/${item.product.id}`}>
                                        <h3 className="line-clamp-2 font-semibold hover:text-blue-600">
                                            {item.product.name}
                                        </h3>
                                    </Link>

                                    {/* Price with Discount */}
                                    <div className="mt-2">
                                        {item.product.discount && item.product.discount > 0 ? (
                                            formatPriceWithDiscount(item.product.price, item.product.discount, item.product.discount_type)
                                        ) : (
                                            <p className="text-lg font-bold text-gray-800">
                                                {formatPrice(item.product.price)}
                                            </p>
                                        )}
                                    </div>

                                    {item.product.description && (
                                        <p className="mt-2 line-clamp-2 text-xs text-gray-600">
                                            {item.product.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-4 space-y-2 pt-4">
                                        <Button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="w-full"
                                            variant="default"
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                        <Button asChild variant="outline" className="w-full" size="sm">
                                            <Link href={`/products/${item.product.id}`}>View Details</Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleRemove(item.id, item.product.id)}
                                            variant="outline"
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="mb-4 text-gray-500">Your wishlist is empty</p>
                            <Button asChild>
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CustomerLayout>
    );
}

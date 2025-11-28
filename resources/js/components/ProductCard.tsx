import { Product } from '@/types';
import { formatPrice } from '@/utils/helper';
import { Link } from '@inertiajs/react';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from 'react-use-cart';
import WishlistButton from './WishlistButton';
// import { useState } from 'react';

// Helper function to strip HTML tags and truncate by words
const stripHtmlAndTruncateByWords = (html: string, maxWords: number = 20) => {
    const stripped = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = stripped.split(' ').filter(word => word.length > 0);
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : stripped;
};

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



export default function ProductCard({ product, viewMode = 'grid' }: { product: Product; viewMode?: 'grid' | 'list' }) {
    const { addItem, items, updateItemQuantity } = useCart();

    // Get the main image - prefer primary gallery image, fallback to product.image
    const getMainImage = () => {
        const primaryImage = product.images?.find(img => img.is_primary);
        return primaryImage ? primaryImage.image_path : product.image;
    };

    // Calculate stock from product.stock
    const currentStock = product.stock || 0;

    const handleAddToCart = () => {
        if (currentStock === 0) {
            return; // Don't add to cart if no stock
        }

        const productId = String(product.id);
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount, product.discount_type);

        if (items.some((item) => item.id === productId)) {
            const existingItem = items.find((item) => item.id === productId);
            const newQuantity = Number(existingItem?.quantity) + 1;
            if (newQuantity > currentStock) {
                return; // Don't update if would exceed stock
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
        // Item added to cart silently - no redirect
    };

    if (viewMode === 'list') {
        return (
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="flex">
                    <div className="relative h-48 w-48 overflow-hidden">
                        <img src={`/storage/${getMainImage()}`} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 justify-between p-6">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-black normal-case">{product.name}</h3>
                            {product.discount && product.discount > 0 ? (
                                <div className="mb-2">
                                    {formatPriceWithDiscount(product.price, product.discount, product.discount_type)}
                                </div>
                            ) : (
                                <p className="mb-2 text-gray-600">{formatPrice(product.price)}</p>
                            )}
                            <div className="mb-4 space-y-2">
                                {product.sku && (
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">SKU:</span> {product.sku}
                                    </p>
                                )}
                                {product.dimension && (
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Dimension:</span> {product.dimension}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Stock:</span>
                                    <span className={`ml-1 ${currentStock === 0 ? 'text-red-600' : (currentStock >= 1 && currentStock <= 3 ? 'text-red-600' : (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))}`}>
                                        {currentStock === 0 ? 'Out of stock' : (currentStock >= 1 && currentStock <= 3 ? `Only ${currentStock} left` : `${currentStock} available`)}
                                    </span>
                                </p>
                            </div>
                            <p className="text-gray-500">{stripHtmlAndTruncateByWords(product.description, 10)}</p>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <Link
                                href={`/products/${product.id}`}
                                className="inline-flex w-fit items-center gap-2 rounded-md bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
                            >
                                <Eye className="h-4 w-4" />
                                View Details
                            </Link>
                            <div className="flex items-center gap-2">
                                <WishlistButton productId={product.id} />
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentStock === 0}
                                    className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${currentStock === 0
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    title={currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                    src={`/storage/${getMainImage()}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <WishlistButton productId={product.id} className="text-white drop-shadow-md" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                        href={`/products/${product.id}`}
                        className="flex items-center gap-2 rounded-md bg-white px-6 py-2 text-black hover:bg-gray-100 transition-colors duration-200"
                    >
                        <Eye className="h-4 w-4" />
                        View Details
                    </Link>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="grow">
                    <h3 className="text-lg font-semibold text-black normal-case">
                        <Link
                            href={`/products/${product.id}`}
                            className="hover:text-gray-600 transition-colors duration-200"
                        >
                            {product.name}
                        </Link>
                    </h3>
                    {product.discount && product.discount > 0 ? (
                        <div className="mt-1">
                            {formatPriceWithDiscount(product.price, product.discount, product.discount_type)}
                        </div>
                    ) : (
                        <p className="mt-1 text-gray-600">{formatPrice(product.price)}</p>
                    )}
                    <div className="mt-2 space-y-2">
                        {product.sku && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">SKU:</span> {product.sku}
                            </p>
                        )}
                        {product.dimension && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">Dimension:</span> {product.dimension}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            <span className="font-medium">Stock:</span>
                            <span className={`ml-1 ${currentStock === 0 ? 'text-red-600' : (currentStock >= 1 && currentStock <= 3 ? 'text-red-600' : (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))}`}>
                                {currentStock === 0 ? 'Out of stock' : (currentStock >= 1 && currentStock <= 3 ? `Only ${currentStock} left` : `${currentStock} available`)}
                            </span>
                        </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{stripHtmlAndTruncateByWords(product.description, 10)}</p>
                </div>
                <div className="flex justify-between items-center gap-2 mt-3">
                    <WishlistButton productId={product.id} />
                    <button
                        onClick={handleAddToCart}
                        disabled={currentStock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors ${currentStock === 0
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        title={currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}

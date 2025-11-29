import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProductGallery from '@/components/ProductGallery';
import WishlistButton from '@/components/WishlistButton';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helper';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from 'react-use-cart';

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price: number, discount?: number, discountType?: string): number => {
    if (!discount || discount === 0) return price;
    if (discountType === 'percentage') {
        return price - price * (discount / 100);
    }
    return price - discount;
};

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem, items, updateItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Calculate stock from product.stock
    const currentStock = product.stock || 0;

    if (!product) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center text-black">
                <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
                <Link href="/products" className="inline-flex items-center gap-2 text-black hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (currentStock === 0) {
            return; // Don't add to cart if no variant selected or no stock
        }

        const quantityNumber = Number(quantity);
        // Use variant ID as unique identifier for cart

        const cartId = product.id;
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount, product.discount_type);

        if (items.some((item) => Number(item.id) === Number(cartId))) {
            const existingItem = items.find((item) => Number(item.id) === Number(cartId));
            const newQuantity = Number(existingItem?.quantity) + quantityNumber;

            // Check if new quantity exceeds available stock
            if (newQuantity > currentStock) {
                return; // Don't update if would exceed stock
            }

            updateItemQuantity(String(cartId), newQuantity);
        } else {
            // Check if requested quantity exceeds available stock
            if (quantityNumber > currentStock) {
                return; // Don't add if exceeds stock
            }

            addItem(
                {
                    ...product,
                    id: String(cartId),
                    price: discountedPrice,
                    originalPrice: product.price,
                    stock: product.stock,
                },
                quantityNumber,
            );
        }
        setQuantity(1);
    };

    return (
        <>
            <Navbar />
            <div className="text-black">
                <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                    <img
                        src="/inspire-8.jpg"
                        alt="Product Detail banner"
                        className="absolute h-full w-full object-cover object-center"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                            <h1 className="text-4xl font-semibold tracking-wide uppercase md:text-5xl lg:text-6xl">PRODUCT DETAIL</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                    <div className="mb-8">
                        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        <div className="group relative">
                            <ProductGallery mainImage={product.image} images={product.images || []} productName={product.name} />
                        </div>
                        <div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 normal-case md:text-4xl lg:text-5xl">{product.name}</h1>
                            {/* Product Details */}
                            <div className="mb-6">
                                <div className="space-y-2">
                                    {product.sku && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">SKU:</span> {product.sku}
                                        </p>
                                    )}
                                    {product.dimension && (
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Dimension:</span>
                                                <span className="ml-1">{product.dimension}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {product.discount && product.discount > 0 ? (
                                <div className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            {formatPrice(calculateDiscountedPrice(product.price, product.discount, product.discount_type))}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-green-600">
                                        {product.discount_type === 'percentage'
                                            ? `Save ${Math.round(product.discount)}%`
                                            : `Save Rp ${Math.round(product.discount)}`}
                                    </p>
                                </div>
                            ) : (
                                <p className="mb-4 text-2xl text-gray-800">{formatPrice(product.price)}</p>
                            )}
                            {/* Stock Information */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Stock:</span>
                                    <span
                                        className={`ml-1 ${
                                            currentStock === 0
                                                ? 'text-red-600'
                                                : currentStock >= 1 && currentStock <= 3
                                                  ? 'text-red-600'
                                                  : currentStock <= 5
                                                    ? 'text-orange-600'
                                                    : 'text-green-600'
                                        }`}
                                    >
                                        {currentStock === 0
                                            ? 'Out of stock'
                                            : currentStock >= 1 && currentStock <= 3
                                              ? `Only ${currentStock} left`
                                              : `${currentStock} available`}
                                    </span>
                                </p>
                            </div>
                            <div className="mb-6">
                                <h2 className="mb-2 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Description</h2>
                                <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                            <div className="mb-8">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Quantity</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentStock === 0}
                                        className={`rounded-full p-2 ${
                                            currentStock === 0 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="w-12 text-center text-xl font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((prev) => Math.min(prev + 1, currentStock || 1))}
                                        disabled={currentStock === 0 || quantity >= currentStock}
                                        className={`rounded-full p-2 ${
                                            currentStock === 0 || quantity >= currentStock ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>{' '}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentStock === 0}
                                    className={`flex w-full items-center justify-center gap-2 rounded-md py-4 transition-colors ${
                                        currentStock === 0 ? 'cursor-not-allowed bg-gray-400 text-gray-200' : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <div className="flex gap-3">
                                    <WishlistButton productId={product.id} className="flex-1" />
                                    <button
                                        onClick={() => router.visit('/products')}
                                        className="flex-1 rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

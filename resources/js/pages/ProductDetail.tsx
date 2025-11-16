import { formatPrice, calculateDiscountedPrice } from '@/utils/helper';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from 'react-use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem, items, updateItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    // Use product-level stock and color directly (no variants)
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
            return; // Don't add to cart if no stock
        }

        const quantityNumber = Number(quantity);
        // Use product ID as cart identifier
        const cartId = String(product.id);

        if (items.some((item) => item.id === cartId)) {
            const existingItem = items.find((item) => item.id === cartId);
            const newQuantity = Number(existingItem?.quantity) + quantityNumber;
            
            // Check if new quantity exceeds available stock
            if (newQuantity > currentStock) {
                return; // Don't update if would exceed stock
            }
            
            updateItemQuantity(cartId, newQuantity);
        } else {
            // Check if requested quantity exceeds available stock
            if (quantityNumber > currentStock) {
                return; // Don't add if exceeds stock
            }
            
            addItem(
                {
                    ...product,
                    id: cartId,
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
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img src="/inspire-8.jpg" alt="Product Detail banner" className="absolute w-full h-full object-cover object-center" style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">PRODUCT DETAIL</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mb-8">
                        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        <div className="relative group">
                            <ProductGallery
                                mainImage={product.image}
                                images={product.images || []}
                                productName={product.name}
                            />
                        </div>

                        <div>
                            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
                            <div className="mb-4">
                                {product.discount && product.discount > 0 ? (
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg text-gray-600 line-through">
                                            {formatPrice(product.price)}
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {formatPrice(calculateDiscountedPrice(product.price, product.discount, product.discount_type || 'fixed'))}
                                        </p>
                                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                                            {product.discount_type === 'fixed' ? `-Rp ${product.discount.toLocaleString('id-ID')}` : `-${product.discount.toFixed(0)}%`}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-2xl text-gray-800">
                                        {formatPrice(product.price)}
                                    </p>
                                )}
                            </div>
                            
            {/* Stock Information */}
            <div className="mb-6">
                <p className="text-sm text-gray-500">
                    <span className="font-medium">Stock:</span> 
                    <span className={`ml-1 ${
                        currentStock === 0 ? 'text-red-600' : 
                        (currentStock === 1 ? 'text-red-600' : 
                        (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))
                    }`}>
                        {currentStock === 0 ? 'Out of stock' : 
                         (currentStock === 1 ? 'Only 1 left' : 
                         (currentStock <= 5 ? `Only ${currentStock} left` : 
                         `${currentStock} available`))}
                    </span>
                </p>
            </div>            {/* Product Details */}
            <div className="mb-6">
                <h2 className="mb-2 font-semibold">Product Details</h2>
                <div className="space-y-2">
                    {product.sku && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">SKU:</span> {product.sku}
                        </p>
                    )}
                </div>
            </div>                            <div className="mb-6">
                                <h2 className="mb-2 font-semibold">Description</h2>
                                <div
                                    className="text-gray-600 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>

            <div className="mb-8">
                <h2 className="mb-4 font-semibold">Quantity</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                        disabled={currentStock === 0}
                        className={`rounded-full p-2 ${
                            currentStock === 0
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center text-xl font-medium">{quantity}</span>
                    <button 
                        onClick={() => setQuantity((prev) => Math.min(prev + 1, currentStock || 1))}
                        disabled={currentStock === 0 || quantity >= currentStock}
                        className={`rounded-full p-2 ${
                            currentStock === 0 || quantity >= currentStock
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentStock === 0}
                                    className={`flex w-full items-center justify-center gap-2 rounded-md py-4 transition-colors ${
                                        currentStock === 0
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={() => router.visit('/products')}
                                    className="w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

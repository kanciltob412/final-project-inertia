import { formatPrice } from '@/utils/helper';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from 'react-use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import { Product, ProductVariant } from '@/types';

// Helper function to convert hex color to readable color name
const getColorName = (colorValue: string) => {
    // If it's already a color name (not hex), return as is
    if (!colorValue.startsWith('#')) {
        return colorValue.charAt(0).toUpperCase() + colorValue.slice(1).toLowerCase();
    }
    
    // Common hex to color name mappings
    const colorMap: Record<string, string> = {
        '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue', '#FFFF00': 'Yellow',
        '#FF00FF': 'Magenta', '#00FFFF': 'Cyan', '#FFA500': 'Orange', '#800080': 'Purple',
        '#FFC0CB': 'Pink', '#A52A2A': 'Brown', '#808080': 'Gray', '#000000': 'Black',
        '#FFFFFF': 'White', '#FFE4E1': 'Misty Rose', '#F0E68C': 'Khaki', '#E6E6FA': 'Lavender',
        '#F5DEB3': 'Wheat', '#DDA0DD': 'Plum', '#98FB98': 'Pale Green', '#F0F8FF': 'Alice Blue',
        '#FAEBD7': 'Antique White', '#D2691E': 'Chocolate', '#FF7F50': 'Coral', '#6495ED': 'Cornflower Blue',
        '#DC143C': 'Crimson', '#B22222': 'Fire Brick', '#228B22': 'Forest Green', '#FFD700': 'Gold',
        '#DAA520': 'Golden Rod', '#ADFF2F': 'Green Yellow', '#FF69B4': 'Hot Pink', '#4B0082': 'Indigo',
        '#32CD32': 'Lime Green', '#800000': 'Maroon', '#000080': 'Navy', '#808000': 'Olive',
        '#FF4500': 'Orange Red', '#DA70D6': 'Orchid', '#CD853F': 'Peru', '#B0E0E6': 'Powder Blue',
        '#663399': 'Rebecca Purple', '#FA8072': 'Salmon', '#F4A460': 'Sandy Brown', '#2E8B57': 'Sea Green',
        '#A0522D': 'Sienna', '#C0C0C0': 'Silver', '#87CEEB': 'Sky Blue', '#708090': 'Slate Gray',
        '#FFFAFA': 'Snow', '#00FF7F': 'Spring Green', '#4682B4': 'Steel Blue', '#D2B48C': 'Tan',
        '#008080': 'Teal', '#D8BFD8': 'Thistle', '#FF6347': 'Tomato', '#40E0D0': 'Turquoise',
        '#EE82EE': 'Violet', '#F5F5DC': 'Beige'
    };
    
    const upperHex = colorValue.toUpperCase();
    if (colorMap[upperHex]) return colorMap[upperHex];
    
    // Simple color detection for unlisted hex codes
    try {
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        if (r > 200 && g < 100 && b < 100) return 'Red';
        if (r < 100 && g > 200 && b < 100) return 'Green';
        if (r < 100 && g < 100 && b > 200) return 'Blue';
        if (r > 200 && g > 200 && b < 100) return 'Yellow';
        if (r > 200 && g < 100 && b > 200) return 'Magenta';
        if (r < 100 && g > 200 && b > 200) return 'Cyan';
        if (r > 150 && g > 100 && b < 100) return 'Orange';
        if (r > 100 && g < 100 && b > 100) return 'Purple';
        if (r > 200 && g > 150 && b > 150) return 'Pink';
        if (r < 100 && g < 100 && b < 100) return 'Black';
        if (r > 200 && g > 200 && b > 200) return 'White';
        if (Math.abs(r - g) < 50 && Math.abs(g - b) < 50) return 'Gray';
        
        return 'Custom Color';
    } catch {
        return colorValue;
    }
};

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem, items, updateItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    // Handle variants - use first available variant as default
    const availableVariants = product.variants?.filter(v => v.is_active !== false) || [];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        availableVariants.length > 0 ? availableVariants[0] : null
    );
    
    // Calculate current stock based on selected variant
    const currentStock = selectedVariant?.stock || 0;

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
        if (!selectedVariant || currentStock === 0) {
            return; // Don't add to cart if no variant selected or no stock
        }

        const quantityNumber = Number(quantity);
        // Use variant ID as unique identifier for cart
        const variantCartId = `${product.id}-${selectedVariant.id || selectedVariant.color}`;

        if (items.some((item) => item.id === variantCartId)) {
            const existingItem = items.find((item) => item.id === variantCartId);
            const newQuantity = Number(existingItem?.quantity) + quantityNumber;
            
            // Check if new quantity exceeds available stock
            if (newQuantity > currentStock) {
                return; // Don't update if would exceed stock
            }
            
            updateItemQuantity(variantCartId, newQuantity);
        } else {
            // Check if requested quantity exceeds available stock
            if (quantityNumber > currentStock) {
                return; // Don't add if exceeds stock
            }
            
            addItem(
                {
                    ...product,
                    id: variantCartId,
                    price: product.price,
                    variantId: selectedVariant.id,
                    color: selectedVariant.color,
                    stock: selectedVariant.stock
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
                            <p className="mb-4 text-2xl text-gray-800">{formatPrice(product.price)}</p>
                            
            {/* Color Variant Selection */}
            {availableVariants.length > 0 && (
                <div className="mb-6">
                    <h2 className="mb-3 font-semibold">Available Colors</h2>
                    <div className="flex flex-wrap gap-3">
                        {availableVariants.map((variant) => (
                            <button
                                key={variant.id || variant.color}
                                onClick={() => setSelectedVariant(variant)}
                                className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                                    selectedVariant?.color === variant.color
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                                    style={{ backgroundColor: variant.color }}
                                />
                                <div className="text-left">
                                    <p className="text-sm font-medium">{getColorName(variant.color)}</p>
                                    <p className={`text-xs ${
                                        variant.stock === 0 ? 'text-red-600' : 
                                        (variant.stock <= 3 ? 'text-orange-600' : 'text-green-600')
                                    }`}>
                                        {variant.stock === 0 ? 'Out of stock' : 
                                         (variant.stock <= 3 ? `${variant.stock} left` : 'In stock')}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Stock Information */}
            <div className="mb-6">
                <p className="text-sm text-gray-500">
                    <span className="font-medium">Stock:</span> 
                    <span className={`ml-1 ${
                        currentStock === 0 ? 'text-red-600' : 
                        (currentStock >= 1 && currentStock <= 3 ? 'text-red-600' : 
                        (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))
                    }`}>
                        {currentStock === 0 ? 'Out of stock' : 
                         (currentStock >= 1 && currentStock <= 3 ? `Only ${currentStock} left` : 
                         `${currentStock} available`)}
                    </span>
                </p>
            </div>            {/* Product Details */}
            <div className="mb-6">
                <h2 className="mb-2 font-semibold">Product Details</h2>
                <div className="space-y-2">
                    {product.sku && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Base SKU:</span> {product.sku}
                        </p>
                    )}
                    {selectedVariant?.sku && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Variant SKU:</span> {selectedVariant.sku}
                        </p>
                    )}
                    {selectedVariant && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">Selected Color:</span> 
                            <div 
                                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                                style={{ backgroundColor: selectedVariant.color }}
                                title={getColorName(selectedVariant.color)}
                            ></div>
                            <span>{getColorName(selectedVariant.color)}</span>
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
                        disabled={currentStock === 0 || !selectedVariant}
                        className={`rounded-full p-2 ${
                            currentStock === 0 || !selectedVariant
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center text-xl font-medium">{quantity}</span>
                    <button 
                        onClick={() => setQuantity((prev) => Math.min(prev + 1, currentStock || 1))}
                        disabled={currentStock === 0 || quantity >= currentStock || !selectedVariant}
                        className={`rounded-full p-2 ${
                            currentStock === 0 || quantity >= currentStock || !selectedVariant
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
                                    disabled={currentStock === 0 || !selectedVariant}
                                    className={`flex w-full items-center justify-center gap-2 rounded-md py-4 transition-colors ${
                                        currentStock === 0 || !selectedVariant
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {!selectedVariant ? 'Select Color' : (currentStock === 0 ? 'Out of Stock' : 'Add to Cart')}
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

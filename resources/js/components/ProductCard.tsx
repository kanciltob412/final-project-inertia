import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/utils/helper';
import { Link, router } from '@inertiajs/react';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { useState } from 'react';

// Helper function to strip HTML tags and truncate by words
const stripHtmlAndTruncateByWords = (html: string, maxWords: number = 20) => {
    const stripped = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = stripped.split(' ').filter(word => word.length > 0);
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : stripped;
};

// Helper function to convert hex color to readable color name
const getColorName = (colorValue: string) => {
    // If it's already a color name (not hex), return as is
    if (!colorValue.startsWith('#')) {
        return colorValue.charAt(0).toUpperCase() + colorValue.slice(1).toLowerCase();
    }
    
    // Common hex to color name mappings
    const colorMap: Record<string, string> = {
        '#FF0000': 'Red',
        '#00FF00': 'Green',
        '#0000FF': 'Blue',
        '#FFFF00': 'Yellow',
        '#FF00FF': 'Magenta',
        '#00FFFF': 'Cyan',
        '#FFA500': 'Orange',
        '#800080': 'Purple',
        '#FFC0CB': 'Pink',
        '#A52A2A': 'Brown',
        '#808080': 'Gray',
        '#000000': 'Black',
        '#FFFFFF': 'White',
        '#FFE4E1': 'Misty Rose',
        '#F0E68C': 'Khaki',
        '#E6E6FA': 'Lavender',
        '#F5DEB3': 'Wheat',
        '#DDA0DD': 'Plum',
        '#98FB98': 'Pale Green',
        '#F0F8FF': 'Alice Blue',
        '#FAEBD7': 'Antique White',
        '#D2691E': 'Chocolate',
        '#FF7F50': 'Coral',
        '#6495ED': 'Cornflower Blue',
        '#DC143C': 'Crimson',
        '#B22222': 'Fire Brick',
        '#228B22': 'Forest Green',
        '#FFD700': 'Gold',
        '#DAA520': 'Golden Rod',
        '#ADFF2F': 'Green Yellow',
        '#FF69B4': 'Hot Pink',
        '#4B0082': 'Indigo',
        '#32CD32': 'Lime Green',
        '#800000': 'Maroon',
        '#000080': 'Navy',
        '#808000': 'Olive',
        '#FF4500': 'Orange Red',
        '#DA70D6': 'Orchid',
        '#CD853F': 'Peru',
        '#B0E0E6': 'Powder Blue',
        '#663399': 'Rebecca Purple',
        '#FA8072': 'Salmon',
        '#F4A460': 'Sandy Brown',
        '#2E8B57': 'Sea Green',
        '#A0522D': 'Sienna',
        '#C0C0C0': 'Silver',
        '#87CEEB': 'Sky Blue',
        '#708090': 'Slate Gray',
        '#FFFAFA': 'Snow',
        '#00FF7F': 'Spring Green',
        '#4682B4': 'Steel Blue',
        '#D2B48C': 'Tan',
        '#008080': 'Teal',
        '#D8BFD8': 'Thistle',
        '#FF6347': 'Tomato',
        '#40E0D0': 'Turquoise',
        '#EE82EE': 'Violet',
        '#F5F5DC': 'Beige',
    };
    
    // Convert to uppercase for comparison
    const upperHex = colorValue.toUpperCase();
    
    // Check direct match first
    if (colorMap[upperHex]) {
        return colorMap[upperHex];
    }
    
    // If no direct match, try to determine closest color
    // Convert hex to RGB and find closest match
    try {
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Simple color detection based on RGB values
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
        return colorValue; // Return original if parsing fails
    }
};

export default function ProductCard({ product, viewMode = 'grid' }: { product: Product; viewMode?: 'grid' | 'list' }) {
    const { addItem, items, updateItemQuantity } = useCart();
    
    // Get the main image - prefer primary gallery image, fallback to product.image
    const getMainImage = () => {
        const primaryImage = product.images?.find(img => img.is_primary);
        return primaryImage ? primaryImage.image_path : product.image;
    };
    
    // Handle variants - use first available variant as default
    const availableVariants = product.variants?.filter(v => v.is_active !== false) || [];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        availableVariants.length > 0 ? availableVariants[0] : null
    );
    
    // Calculate total stock and selected variant stock
    const totalStock = availableVariants.reduce((sum, variant) => sum + variant.stock, 0);
    const currentStock = selectedVariant?.stock || 0;
    
    const handleAddToCart = () => {
        if (!selectedVariant || currentStock === 0) {
            return; // Don't add to cart if no variant selected or no stock
        }

        // Use variant ID as unique identifier for cart
        const variantCartId = `${product.id}-${selectedVariant.id || selectedVariant.color}`;
        
        if (items.some((item) => item.id === variantCartId)) {
            const existingItem = items.find((item) => item.id === variantCartId);
            const newQuantity = Number(existingItem?.quantity) + 1;
            
            // Check if new quantity would exceed available stock
            if (newQuantity > currentStock) {
                return; // Don't update if would exceed stock
            }
            
            updateItemQuantity(variantCartId, newQuantity);
        } else {
            addItem(
                {
                    ...product,
                    id: variantCartId,
                    price: product.price,
                    variantId: selectedVariant.id,
                    color: selectedVariant.color,
                    stock: selectedVariant.stock
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
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-black">{product.name}</h3>
                            <p className="mb-2 text-gray-600">{formatPrice(product.price)}</p>
                            <div className="mb-4 space-y-2">
                                {product.sku && (
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">SKU:</span> {product.sku}
                                    </p>
                                )}
                                {availableVariants.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Colors:</span>
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {availableVariants.map((variant) => (
                                                <button
                                                    key={variant.id || variant.color}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`w-6 h-6 rounded border-2 shadow-sm hover:scale-110 transition-transform ${
                                                        selectedVariant?.color === variant.color
                                                            ? 'border-black border-4'
                                                            : 'border-gray-300'
                                                    }`}
                                                    style={{ backgroundColor: variant.color }}
                                                    title={`${getColorName(variant.color)} - Stock: ${variant.stock}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {currentStock !== undefined && (
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Stock:</span> 
                                        <span className={`ml-1 ${currentStock === 0 ? 'text-red-600' : (currentStock >= 1 && currentStock <= 3 ? 'text-red-600' : (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))}`}>
                                            {currentStock === 0 ? 'Out of stock' : (currentStock >= 1 && currentStock <= 3 ? `Only ${currentStock} left` : `${currentStock} available`)}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <p className="text-gray-500">{stripHtmlAndTruncateByWords(product.description, 10)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <Link
                                href={`/products/${product.id}`}
                                className="inline-flex w-fit items-center gap-2 rounded-md bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
                            >
                                <Eye className="h-4 w-4" />
                                View Details
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                disabled={currentStock === 0 || !selectedVariant}
                                className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                                    currentStock === 0 || !selectedVariant
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
                    <h3 className="text-lg font-semibold text-black">
                        <Link
                            href={`/products/${product.id}`}
                            className="hover:text-gray-600 transition-colors duration-200"
                        >
                            {product.name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-gray-600">{formatPrice(product.price)}</p>
                    <div className="mt-2 space-y-2">
                        {product.sku && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">SKU:</span> {product.sku}
                            </p>
                        )}
                        {availableVariants.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">
                                    <span className="font-medium">Colors:</span>
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {availableVariants.map((variant) => (
                                        <button
                                            key={variant.id || variant.color}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`w-5 h-5 rounded border-2 shadow-sm hover:scale-110 transition-transform ${
                                                selectedVariant?.color === variant.color
                                                    ? 'border-black border-4'
                                                    : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: variant.color }}
                                            title={`${getColorName(variant.color)} - Stock: ${variant.stock}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {currentStock !== undefined && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">Stock:</span> 
                                <span className={`ml-1 ${currentStock === 0 ? 'text-red-600' : (currentStock >= 1 && currentStock <= 3 ? 'text-red-600' : (currentStock <= 5 ? 'text-orange-600' : 'text-green-600'))}`}>
                                    {currentStock === 0 ? 'Out of stock' : (currentStock >= 1 && currentStock <= 3 ? `Only ${currentStock} left` : `${currentStock} available`)}
                                </span>
                            </p>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{stripHtmlAndTruncateByWords(product.description, 10)}</p>
                </div>
                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={currentStock === 0 || !selectedVariant}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                            currentStock === 0 || !selectedVariant
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

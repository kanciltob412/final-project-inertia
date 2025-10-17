import { products } from '@/data/products';
import { formatPrice } from '@/utils/helper';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from 'react-use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PageProps = {
    product?: {
        id: number;
        name: string;
        price: number;
        image: string;
        description: string;
    };
    id?: number; // dikirim dari controller
};

export default function ProductDetail() {
    const { props } = usePage<PageProps>();
    const { addItem, items, updateItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);

    const resolvedId = props.product?.id ?? (typeof props.id === 'number' ? props.id : undefined);

    const product = props.product ?? (resolvedId !== undefined ? products.find((p) => p.id === resolvedId) : undefined);

    console.log('props', props);
    console.log('resolvedId', resolvedId);
    console.log('product', product);

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
        const quantityNumber = Number(quantity);

        if (items.some((item) => parseInt(item.id) === product.id)) {
            const existingItem = items.find((item) => parseInt(item.id) === product.id);
            const newQuantity = Number(existingItem?.quantity) + quantityNumber;
            updateItemQuantity(product.id.toString(), newQuantity);
        } else {
            addItem(
                {
                    ...product,
                    price: product.price,
                    id: product.id.toString(),
                },
                quantityNumber,
            );
        }
        setQuantity(1);
    };

    return (
        <div>
            <Navbar />
            <div className="text-black">
                {/* Banner (matching About/Craftsmanship/Contact/Products) */}
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img src={product.image} alt="Product detail banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
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
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>

                        <div>
                            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
                            <p className="mb-6 text-2xl text-gray-800">{formatPrice(product.price)}</p>

                            <div className="mb-6">
                                <h2 className="mb-2 font-semibold">Description</h2>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            <div className="mb-8">
                                <h2 className="mb-4 font-semibold">Quantity</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                                        className="rounded-full p-2 hover:bg-gray-100"
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="w-12 text-center text-xl font-medium">{quantity}</span>
                                    <button onClick={() => setQuantity((prev) => prev + 1)} className="rounded-full p-2 hover:bg-gray-100">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-4 text-white hover:bg-gray-800"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

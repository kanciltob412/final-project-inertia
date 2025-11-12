import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { router, usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';
import { SharedData } from '@/types';

export default function Cart() {
    const { cartTotal, items, updateItemQuantity, removeItem } = useCart();
    const { auth } = usePage<SharedData>().props;

    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div>
                    <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                        <img src="/inspire-9.jpg" alt="Shopping Cart banner" className="absolute w-full h-full object-cover object-center" style={{ filter: 'brightness(0.6)' }} />
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                                <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">SHOPPING CART</h1>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                        <div className="flex items-center justify-center">
                            <img src="/your-cart-empty.png" alt="" width={400} />
                        </div>
                        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
                        {auth.user ? (
                            <button
                                onClick={() => router.visit('/checkout')}
                                className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <button
                                onClick={() => router.visit('/products')}
                                className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                            >
                                Continue Shopping
                            </button>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/inspire-9.jpg" alt="Shopping Cart banner" className="absolute w-full h-full object-cover object-center" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                        <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">SHOPPING CART</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-16">
                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col md:flex-row items-center justify-between rounded-lg border p-4 shadow-sm"
                            >
                                <div className="flex items-center space-x-4">
                                    <a href={`/products/${item.id}`}>
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.name}
                                            className="h-24 w-24 rounded-md object-cover"
                                        />
                                    </a>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{item.company}</p>
                                        <p className="text-sm text-gray-500">
                                            Category: {item.category.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end mt-4 md:mt-0 space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateItemQuantity(item.id, item.quantity! - 1)}
                                            disabled={item.quantity! <= 1}
                                            className="rounded-md border p-1 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItemQuantity(item.id, item.quantity! + 1)}
                                            className="rounded-md border p-1 hover:bg-gray-100"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <p className="font-semibold text-gray-800">
                                        {formatPrice(item.itemTotal || 0)}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="flex items-center text-red-500 hover:underline"
                                    >
                                        <Trash2 size={16} className="mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="rounded-lg border p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Total</span>
                            <span className="font-semibold">{formatPrice(cartTotal)}</span>
                        </div>
                        {auth.user ? (
                            <button
                                onClick={() => router.visit('/checkout')}
                                className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <button
                                onClick={() => router.visit('/login')}
                                className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                            >
                                Login to Checkout
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
}

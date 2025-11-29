import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';

interface CartPageProps extends SharedData {
    products: Product[];
}

export default function Cart() {
    const { cartTotal, items, updateItemQuantity, removeItem } = useCart();
    const { auth } = usePage<CartPageProps>().props;

    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div>
                    <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                        <img
                            src="/inspire-9.jpg"
                            alt="Shopping Cart banner"
                            className="absolute h-full w-full object-cover object-center"
                            style={{ filter: 'brightness(0.6)' }}
                        />
                        <div className="absolute inset-0 flex items-center">
                            <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                                <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">SHOPPING CART</h1>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 py-8 text-center md:px-6 md:py-12 lg:px-8 lg:py-16">
                        <div className="flex items-center justify-center">
                            <img src="/your-cart-empty.png" alt="" width={400} />
                        </div>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">Your cart is empty</h2>
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
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img
                    src="/inspire-9.jpg"
                    alt="Shopping Cart banner"
                    className="absolute h-full w-full object-cover object-center"
                    style={{ filter: 'brightness(0.6)' }}
                />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide uppercase md:text-5xl">SHOPPING CART</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Cart Items */}
                    <div className="space-y-6 md:col-span-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col items-center justify-between rounded-lg border p-4 shadow-sm md:flex-row">
                                <div className="flex items-center space-x-4">
                                    <a href={`/products/${item.id.split('-')[0]}`}>
                                        <img src={`/storage/${item.image}`} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                                    </a>
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.company}</p>
                                        <p className="text-sm text-gray-500">Category: {item.category?.name || 'Uncategorized'}</p>
                                        {item.dimension && <p className="text-sm text-gray-500">Dimension: {item.dimension}</p>}
                                        {/* Stock information */}
                                        <p className="text-xs text-gray-500">
                                            <span className="font-medium">Stock:</span>
                                            <span
                                                className={`ml-1 ${
                                                    (item.stock || 0) === 0
                                                        ? 'text-red-600'
                                                        : (item.stock || 0) >= 1 && (item.stock || 0) <= 3
                                                          ? 'text-red-600'
                                                          : (item.stock || 0) <= 5
                                                            ? 'text-orange-600'
                                                            : 'text-green-600'
                                                }`}
                                            >
                                                {(item.stock || 0) === 0
                                                    ? 'Out of stock'
                                                    : (item.stock || 0) >= 1 && (item.stock || 0) <= 3
                                                      ? `Only ${item.stock} left`
                                                      : `${item.stock} available`}
                                            </span>
                                        </p>
                                        {item.discount && item.discount > 0 && (
                                            <p className="mt-1 text-sm font-medium text-red-600">
                                                Discount:{' '}
                                                {item.discount_type === 'percentage'
                                                    ? `${Math.round(item.discount)}%`
                                                    : `Rp ${Math.round(item.discount).toLocaleString('id-ID')}`}
                                            </p>
                                        )}
                                        {/* Warning for quantity exceeding stock */}
                                        {item.quantity! > (item.stock || 0) && (item.stock || 0) > 0 && (
                                            <p className="mt-1 text-xs font-medium text-red-600">
                                                ⚠️ Quantity exceeds available stock ({item.stock} available)
                                            </p>
                                        )}
                                        {(item.stock || 0) === 0 && (
                                            <p className="mt-1 text-xs font-medium text-red-600">⚠️ This variant is currently out of stock</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col items-center space-y-2 md:mt-0 md:items-end">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateItemQuantity(item.id, item.quantity! - 1)}
                                            disabled={item.quantity! <= 1}
                                            className="rounded-md border p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItemQuantity(item.id, item.quantity! + 1)}
                                            disabled={(item.stock || 0) === 0 || item.quantity! >= (item.stock || 0)}
                                            className={`rounded-md border p-1 ${
                                                (item.stock || 0) === 0 || item.quantity! >= (item.stock || 0)
                                                    ? 'cursor-not-allowed text-gray-400 opacity-50'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            title={
                                                (item.stock || 0) === 0
                                                    ? 'Out of stock'
                                                    : item.quantity! >= (item.stock || 0)
                                                      ? 'Maximum stock reached'
                                                      : 'Increase quantity'
                                            }
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <p className="font-semibold text-gray-800">
                                        {item.discount && item.discount > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatPrice(
                                                        item.discount_type === 'percentage'
                                                            ? (item.price * (item.quantity || 1)) / (1 - item.discount / 100)
                                                            : item.price * (item.quantity || 1) + item.discount * (item.quantity || 1),
                                                    )}
                                                </p>
                                                <p className="text-lg text-green-600">{formatPrice(item.itemTotal || 0)}</p>
                                            </div>
                                        ) : (
                                            formatPrice(item.itemTotal || 0)
                                        )}
                                    </p>
                                    <button onClick={() => removeItem(item.id)} className="flex items-center text-red-500 hover:underline">
                                        <Trash2 size={16} className="mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="h-fit rounded-lg border p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Order Summary</h2>
                        <div className="mb-2 flex justify-between">
                            <span>Total</span>
                            <span className="font-semibold">{formatPrice(cartTotal)}</span>
                        </div>
                        {auth.user ? (
                            <>
                                <button
                                    onClick={() => router.visit('/checkout')}
                                    className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => router.visit('/products')}
                                    className="mt-3 w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
                                >
                                    Continue Shopping
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.visit('/checkout')}
                                    className="mt-6 w-full rounded-md bg-black py-3 text-white hover:bg-gray-800"
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => router.visit('/products')}
                                    className="mt-3 w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
                                >
                                    Continue Shopping
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

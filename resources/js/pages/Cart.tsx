import Hero from '../components/Hero';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';

export default function Cart() {
    const { cartTotal, items, updateItemQuantity, removeItem } = useCart();

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div>
                    <Hero title={'Shopping Cart'} description={'Check out your cart'} image={'/cart.png'} />
                    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                        <div className="flex items-center justify-center">
                            <img src="/empty_cart.png" alt="" width={400} />
                        </div>
                        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
                        {storedUser?.token ? (
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
        <div>
            <Navbar />
            <div>
                {/* Write Your Code Here */}
            </div>
            <Footer />
        </div>
    );
}

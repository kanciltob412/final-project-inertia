import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';
import order from '@/routes/orders';


export default function Checkout() {
    const { items, cartTotal, emptyCart } = useCart();

    const { data, setData, processing, errors } = useForm({
        address: '',
        phone: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            products: items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
        };

        router.post(order.pay().url, payload, {
            onSuccess: () => {
                emptyCart();
            },
        });
    };

    if (items.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img src="/inspire-10.jpg" alt="Checkout banner" className="absolute w-full h-full object-cover object-top" style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">CHECKOUT</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                    <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
                    <button
                        onClick={() => router.visit('/products')}
                        className="inline-flex items-center gap-2 text-black hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/inspire-10.jpg" alt="Checkout banner" className="absolute w-full h-full object-cover object-top" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                        <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">CHECKOUT</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 py-16 grid gap-8 md:grid-cols-2">
                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            id="country"
                            name="country"
                            type="text"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                            Postal Code
                        </label>
                        <input
                            id="postal_code"
                            name="postal_code"
                            type="text"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-md bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>
                </form>

                {/* Cart Summary */}
                <div className="rounded-lg border p-6 shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <span className="font-semibold">
                                    {formatPrice(item.itemTotal || 0)}
                                </span>
                            </div>
                        ))}
                        <hr className="my-4" />
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
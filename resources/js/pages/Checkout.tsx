import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useForm, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { formatPrice } from '../utils/helper';
import { SharedData } from '@/types';


export default function Checkout() {
    const { items, cartTotal, emptyCart } = useCart();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, processing, errors } = useForm({
        full_name: '',
        email: auth.user ? '' : '', // Email only needed for guest users
        password: '',
        create_account: false,
        phone: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build base payload
        let payload: any = {
            full_name: data.full_name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            country: data.country,
            postal_code: data.postal_code,
            products: items.map((item) => ({
                id: item.id.includes('-') ? item.id.split('-')[0] : item.id, // Base product ID
                variant_id: item.variantId || null, // Variant ID if exists
                color: item.color || null, // Color information
                quantity: item.quantity,
            })),
        };

        // Add email for both user types
        if (!auth.user) {
            // For guest users, use form email (no account creation)
            payload.email = data.email;
            console.log('Guest user - email from form:', data.email);
        } else {
            // For authenticated users, use their email
            payload.email = auth.user.email;
            console.log('Authenticated user - email from auth:', auth.user.email);
        }

        console.log('Auth user object:', auth.user);
        console.log('Submitting payload:', payload);

        router.post('/orders/pay', payload, {
            onStart: () => {
                console.log('Starting order submission...');
            },
            onSuccess: (page) => {
                console.log('Order successful! Server response:', page);
                // Don't empty cart here - wait until payment is completed
            },
            onError: (errors) => {
                console.error('Order submission errors:', errors);
                console.error('Full error object:', JSON.stringify(errors, null, 2));
                
                // Show user-friendly error message
                let errorMessage = 'An error occurred during checkout.';
                if (errors.checkout) {
                    errorMessage = errors.checkout;
                } else if (errors.message) {
                    errorMessage = errors.message;
                }
                
                alert(errorMessage);
            },
            onFinish: () => {
                console.log('Order submission finished');
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
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Details</h2>

                        {/* Login/Register Options for Guest Users */}
                        {!auth.user && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 mb-3">
                                    Already have an account? Login for faster checkout or continue as guest.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/login')}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.visit('/register')}
                                        className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                                    >
                                        Register
                                    </button>
                                </div>
                                <div className="mt-3 text-center">
                                    <span className="text-xs text-gray-500">or continue as guest below</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                    </div>

                    {/* Email field for guest users only */}
                    {!auth.user && (
                        <div>
                            <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="guest_email"
                                name="guest_email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    )}

                    <div>
                    </div>



                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone/WhatsApp (with country code)
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="e.g., +62 812-3456-7890"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="w-full">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Street address, apartment, suite, etc."
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="mt-1 block w-full border-b border-gray-300 focus:ring-0 focus:outline-none"
                            required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-md bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50"
                        onClick={() => console.log('Place Order button clicked')}
                    >
                        {processing ? 'Processing...' : 'Place Order'}
                    </button>

                    {/* Debug: Show any errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                            <h4 className="font-semibold text-red-800">Validation Errors:</h4>
                            {Object.entries(errors).map(([key, error]) => (
                                <p key={key} className="text-red-600 text-sm">
                                    {key}: {error}
                                </p>
                            ))}
                        </div>
                    )}
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
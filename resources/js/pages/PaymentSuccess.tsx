
import { Link, usePage, router } from '@inertiajs/react';
import { CheckCircle, ArrowLeft, Receipt, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface Props {
    order_id?: string;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    is_authenticated?: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export default function PaymentSuccess() {
    const props = usePage().props as Props;
    const order_id = props.order_id;
    const auth = props.auth;
    const isAuthenticated = props.is_authenticated || (auth?.user !== null && auth?.user !== undefined);
    const user = props.user || auth?.user;
    const { emptyCart } = useCart();
    const [hasReloaded, setHasReloaded] = useState(false);

    // Empty cart when payment is successful
    useEffect(() => {
        emptyCart();
    }, [emptyCart]);

    // Reload page once on first load to refresh auth state from middleware
    // This ensures the navbar receives the correct authenticated user after Auth::login()
    useEffect(() => {
        // Check if we've already reloaded using sessionStorage
        // This prevents infinite reload loops even if page is refreshed
        const alreadyReloaded = sessionStorage.getItem('paymentSuccessReloaded');

        if (order_id && !alreadyReloaded && !hasReloaded) {
            console.log('First payment success page load, scheduling single reload to refresh auth state...');
            setHasReloaded(true);
            sessionStorage.setItem('paymentSuccessReloaded', 'true');

            // Give the session a moment to be fully established, then reload
            const timer = setTimeout(() => {
                console.log('Reloading page to refresh auth state and navbar...');
                window.location.reload();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [order_id, hasReloaded]);

    return (
        <div>
            <Navbar />

            {/* Hero Section - Black Theme */}
            <div className="relative h-[300px] overflow-hidden bg-linear-to-br from-black to-gray-900">
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 text-white text-center">
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white">Payment Successful</h1>
                        <p className="text-xl text-gray-300">Thank you! Your payment was processed.</p>
                    </div>
                </div>
            </div>

            {/* Success Content */}
            <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="bg-black rounded-lg shadow-lg p-8 border border-gray-800">
                    <div className="text-center mb-8">
                        <div className="bg-gray-900 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Payment Completed</h2>
                        {order_id && (
                            <p className="text-gray-300">Order ID: <span className="font-mono font-semibold">#{order_id}</span></p>
                        )}
                        {user && (
                            <p className="text-sm text-gray-400 mt-2">Logged in as: {user.email}</p>
                        )}
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-white mb-2">What's Next?</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Your order is confirmed and will be processed shortly. You will receive an email with your order details and tracking information.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <div className="flex items-center mb-3">
                                <Receipt className="h-5 w-5 text-white mr-2" />
                                <h3 className="font-semibold text-white">View Your Order</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                                You can view your order details and track its status in your account.
                            </p>
                            {order_id && (
                                <Link
                                    href={`/orders/${order_id}`}
                                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                    <Receipt className="h-4 w-4 mr-2" />
                                    View Order
                                </Link>
                            )}
                        </div>

                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <div className="flex items-center mb-3">
                                <Mail className="h-5 w-5 text-white mr-2" />
                                <h3 className="font-semibold text-white">Need Help?</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                                If you have any questions or need assistance, please contact our support team.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-800">
                        <Link
                            href="/"
                            className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                        <p className="text-sm text-white">
                            <strong>Order Confirmation:</strong> Your items will be shipped soon. Thank you for shopping with us!
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}


import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Mail, Receipt } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from 'react-use-cart';

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
    const user = props.user || auth?.user;
    const { emptyCart } = useCart();

    // Empty cart when payment is successful
    useEffect(() => {
        emptyCart();
    }, [emptyCart]);

    return (
        <div>
            <Navbar />

            {/* Hero Section - Black Theme */}
            <div className="relative h-[300px] overflow-hidden bg-linear-to-br from-black to-gray-900">
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl px-4 text-center text-white">
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">Payment Successful</h1>
                        <p className="text-xl text-gray-300">Thank you! Your payment was processed.</p>
                    </div>
                </div>
            </div>

            {/* Success Content */}
            <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <div className="rounded-lg border border-gray-800 bg-black p-8 shadow-lg">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 p-4">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">Payment Completed</h2>
                        {order_id && (
                            <p className="text-gray-300">
                                Order ID: <span className="font-mono font-semibold">#{order_id}</span>
                            </p>
                        )}
                        {user && <p className="mt-2 text-sm text-gray-400">Logged in as: {user.email}</p>}
                    </div>

                    <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
                        <h3 className="mb-2 font-semibold text-white">What's Next?</h3>
                        <p className="mb-4 text-sm text-gray-300">
                            Your order is confirmed and will be processed shortly. You will receive an email with your order details and tracking
                            information.
                        </p>
                    </div>

                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                            <div className="mb-3 flex items-center">
                                <Receipt className="mr-2 h-5 w-5 text-white" />
                                <h3 className="font-semibold text-white">View Your Order</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-300">You can view your order details and track its status in your account.</p>
                            {order_id && (
                                <Link
                                    href={`/orders/${order_id}`}
                                    className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                                >
                                    <Receipt className="mr-2 h-4 w-4" />
                                    View Order
                                </Link>
                            )}
                        </div>

                        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                            <div className="mb-3 flex items-center">
                                <Mail className="mr-2 h-5 w-5 text-white" />
                                <h3 className="font-semibold text-white">Need Help?</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-300">
                                If you have any questions or need assistance, please contact our support team.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 border-t border-gray-800 pt-6 sm:flex-row">
                        <Link
                            href="/"
                            className="flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
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

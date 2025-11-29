import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, RefreshCw, XCircle } from 'lucide-react';

export default function PaymentFailed() {
    const props = usePage().props as { order_id?: string };
    const order_id = props.order_id;

    return (
        <div>
            <Navbar />

            {/* Hero Section - Black Theme */}
            <div className="relative h-[300px] overflow-hidden bg-linear-to-br from-black to-gray-900">
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl px-4 text-center text-white">
                        <XCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">Payment Failed</h1>
                        <p className="text-xl text-gray-300">We couldn't process your payment</p>
                    </div>
                </div>
            </div>

            {/* Failure Content */}
            <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <div className="rounded-lg border border-gray-800 bg-black p-8 shadow-lg">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 p-4">
                            <XCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">Payment Unsuccessful</h2>
                        {order_id && (
                            <p className="text-gray-300">
                                Order ID: <span className="font-mono font-semibold">#{order_id}</span>
                            </p>
                        )}
                    </div>

                    <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
                        <h3 className="mb-2 font-semibold text-white">What went wrong?</h3>
                        <p className="mb-4 text-sm text-gray-300">Your payment could not be processed. This might be due to:</p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
                            <li>Insufficient funds in your account</li>
                            <li>Card details were entered incorrectly</li>
                            <li>Your bank declined the transaction</li>
                            <li>Network connectivity issues</li>
                            <li>Payment timeout</li>
                        </ul>
                    </div>

                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                            <div className="mb-3 flex items-center">
                                <RefreshCw className="mr-2 h-5 w-5 text-black" />
                                <h3 className="font-semibold text-gray-900">Try Again</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-700">
                                Your order is still reserved. You can attempt the payment again with the same or different payment method.
                            </p>
                            {order_id && (
                                <Link
                                    href={`/orders/${order_id}/retry-payment`}
                                    className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Retry Payment
                                </Link>
                            )}
                        </div>

                        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                            <div className="mb-3 flex items-center">
                                <Mail className="mr-2 h-5 w-5 text-white" />
                                <h3 className="font-semibold text-white">Need Help?</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-300">
                                If you continue to experience issues, please contact our support team for assistance.
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

                    <div className="border-t pt-6">
                        <h3 className="mb-4 font-semibold text-gray-900">What you can do next:</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold text-white">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Check Your Payment Details</p>
                                    <p className="text-sm text-gray-600">Verify your card number, expiry date, and CVV code are correct</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold text-white">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Contact Your Bank</p>
                                    <p className="text-sm text-gray-600">Ensure your card is activated for online transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mt-0.5 mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold text-white">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Try Alternative Payment</p>
                                    <p className="text-sm text-gray-600">Use a different card or payment method</p>
                                </div>
                            </div>
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
                        <Link
                            href="/cart"
                            className="flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-black"
                        >
                            Return to Cart
                        </Link>
                    </div>

                    <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
                        <p className="text-sm text-white">
                            <strong>Order Reservation:</strong> Your items are held for 24 hours. Please complete your payment within this time to
                            secure your order.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

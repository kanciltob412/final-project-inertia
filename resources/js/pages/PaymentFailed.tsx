import { Link, usePage } from '@inertiajs/react';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function PaymentFailed() {
    const props = usePage().props as { order_id?: string };
    const order_id = props.order_id;

    return (
        <div>
            <Navbar />

            {/* Hero Section - Black Theme */}
            <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-black to-gray-900">
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 text-white text-center">
                        <XCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white">Payment Failed</h1>
                        <p className="text-xl text-gray-300">We couldn't process your payment</p>
                    </div>
                </div>
            </div>

            {/* Failure Content */}
            <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="bg-black rounded-lg shadow-lg p-8 border border-gray-800">
                    <div className="text-center mb-8">
                        <div className="bg-gray-900 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Payment Unsuccessful</h2>
                        {order_id && (
                            <p className="text-gray-300">Order ID: <span className="font-mono font-semibold">#{order_id}</span></p>
                        )}
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-white mb-2">What went wrong?</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Your payment could not be processed. This might be due to:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                            <li>Insufficient funds in your account</li>
                            <li>Card details were entered incorrectly</li>
                            <li>Your bank declined the transaction</li>
                            <li>Network connectivity issues</li>
                            <li>Payment timeout</li>
                        </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-3">
                                <RefreshCw className="h-5 w-5 text-black mr-2" />
                                <h3 className="font-semibold text-gray-900">Try Again</h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                Your order is still reserved. You can attempt the payment again with the same or different payment method.
                            </p>
                            {order_id && (
                                <Link
                                    href={`/orders/${order_id}/retry-payment`}
                                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry Payment
                                </Link>
                            )}
                        </div>

                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <div className="flex items-center mb-3">
                                <Mail className="h-5 w-5 text-white mr-2" />
                                <h3 className="font-semibold text-white">Need Help?</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                                If you continue to experience issues, please contact our support team for assistance.
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

                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">What you can do next:</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</div>
                                <div>
                                    <p className="font-medium text-gray-900">Check Your Payment Details</p>
                                    <p className="text-sm text-gray-600">Verify your card number, expiry date, and CVV code are correct</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</div>
                                <div>
                                    <p className="font-medium text-gray-900">Contact Your Bank</p>
                                    <p className="text-sm text-gray-600">Ensure your card is activated for online transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</div>
                                <div>
                                    <p className="font-medium text-gray-900">Try Alternative Payment</p>
                                    <p className="text-sm text-gray-600">Use a different card or payment method</p>
                                </div>
                            </div>
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
                        <Link
                            href="/cart"
                            className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                        <p className="text-sm text-white">
                            <strong>Order Reservation:</strong> Your items are held for 24 hours.
                            Please complete your payment within this time to secure your order.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
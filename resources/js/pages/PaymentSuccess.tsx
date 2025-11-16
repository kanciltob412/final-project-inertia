import { Link, usePage } from '@inertiajs/react';
import { CheckCircle, ArrowLeft, Mail, Package } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
export default function PaymentSuccess() {
    const props = usePage().props as { order_id?: string };
    const order_id = props.order_id;

    return (
        <div>
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-green-600 to-green-800">
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 text-white text-center">
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-200" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-xl text-green-100">Thank you for your purchase</p>
                    </div>
                </div>
            </div>

            {/* Success Content */}
            <div className="mx-auto max-w-4xl px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-green-200">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed</h2>
                        {order_id && (
                            <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">#{order_id}</span></p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-3">
                                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                                <h3 className="font-semibold text-gray-900">Email Confirmation</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                A confirmation email with your order details has been sent to your email address. 
                                Please check your inbox and spam folder.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-3">
                                <Package className="h-5 w-5 text-green-600 mr-2" />
                                <h3 className="font-semibold text-gray-900">Order Processing</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Your order is now being processed. You will receive a shipping notification 
                                once your items are dispatched.
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Processing</p>
                                    <p className="text-sm text-gray-600">We'll prepare your handcrafted ceramics with care (1-2 business days)</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</div>
                                <div>
                                    <p className="font-medium text-gray-900">Quality Check & Packaging</p>
                                    <p className="text-sm text-gray-600">Each piece is carefully inspected and securely packaged</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</div>
                                <div>
                                    <p className="font-medium text-gray-900">Shipping</p>
                                    <p className="text-sm text-gray-600">Your order will be shipped and you'll receive tracking information</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                        <Link
                            href="/"
                            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Us
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            <strong>Need help?</strong> Contact our customer support team at{' '}
                            <a href="mailto:support@lavanyaceramics.com" className="underline font-medium">
                                support@lavanyaceramics.com
                            </a>{' '}
                            or visit our{' '}
                            <Link href="/contact" className="underline font-medium">
                                contact page
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
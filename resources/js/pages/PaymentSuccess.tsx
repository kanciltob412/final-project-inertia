import { Link, usePage } from '@inertiajs/react';
import { CheckCircle, ArrowLeft, Mail, Package, Home } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useCart } from 'react-use-cart';
import { useEffect } from 'react';

export default function PaymentSuccess() {
    const props = usePage().props as { order_id?: string };
    const order_id = props.order_id;
    const { emptyCart } = useCart();

    // Clear cart on successful payment
    useEffect(() => {
        emptyCart();
    }, [emptyCart]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section - Black and White */}
            <div className="relative h-[350px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                {/* Decorative pattern background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 0.5px, transparent 0.5px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-6xl w-full mx-auto px-4 text-white text-center z-10">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
                                <CheckCircle className="h-20 w-20 text-white drop-shadow-lg" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white">Payment Successful!</h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-light">Thank you for choosing Lavanya Ceramics</p>
                    </div>
                </div>
            </div>

            {/* Success Content */}
            <div className="flex-grow mx-auto w-full max-w-4xl px-4 py-16">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
                        <div className="flex items-center justify-center mb-2">
                            <CheckCircle className="h-8 w-8 mr-3" />
                            <h2 className="text-2xl font-bold">Order Confirmed</h2>
                        </div>
                        {order_id && (
                            <p className="text-center text-gray-300 text-lg">
                                Order #<span className="font-mono font-bold text-white">{order_id}</span>
                            </p>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="p-8">
                        {/* Info Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-300 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-900 text-white rounded-full p-3 mr-3">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Email Confirmation</h3>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    A detailed confirmation email with your order details has been sent to your email address.
                                    Please check your inbox and spam folder.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-300 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-900 text-white rounded-full p-3 mr-3">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Order Processing</h3>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Your order is now being carefully processed. You will receive a shipping notification
                                    with tracking information once your handcrafted pieces are dispatched.
                                </p>
                            </div>
                        </div>

                        {/* What Happens Next */}
                        <div className="border-t border-gray-300 pt-8 mb-8">
                            <h3 className="font-bold text-gray-900 text-xl mb-6">What happens next?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 shrink-0">1</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Order Processing & Verification</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">Our team will verify your order details and begin preparing your handcrafted ceramics (1-2 business days)</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 shrink-0">2</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Quality Check & Artisan Packaging</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">Each piece is carefully inspected for quality and securely packaged with care to ensure it arrives in perfect condition</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 shrink-0">3</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Shipping & Tracking</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">Your order will be shipped and you'll receive an email with tracking information to follow your package's journey</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <Link
                                href="/"
                                className="flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                            <Link
                                href="/products"
                                className="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Support Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border border-gray-300 rounded-lg">
                            <p className="text-sm text-gray-900 leading-relaxed">
                                <strong className="font-bold">Need assistance?</strong> Our dedicated customer support team is here to help. 
                                Contact us at{' '}
                                <a href="mailto:support@lavanyaceramics.com" className="text-gray-900 hover:text-black underline font-semibold transition-colors">
                                    support@lavanyaceramics.com
                                </a>{' '}
                                or visit our{' '}
                                <Link href="/contact" className="text-gray-900 hover:text-black underline font-semibold transition-colors">
                                    contact page
                                </Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
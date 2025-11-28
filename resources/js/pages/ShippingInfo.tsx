import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingInfo() {
    return (
        <div>
            <Head title="Shipping Information" />
            <Navbar />


            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/craft-1.jpg" alt="Shipping Information" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-semibold uppercase tracking-wide">SHIPPING INFORMATION</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">

                <div className="space-y-12 md:space-y-14 lg:space-y-16">
                    <section>
                        <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-6 md:mb-8">Shipping Methods & Costs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                                <h3 className="text-base md:text-lg text-gray-900 font-medium mb-3">Standard Shipping</h3>
                                <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed">Delivery within 5-7 business days</p>
                                <p className="text-sm md:text-base text-gray-900 font-semibold">Free for orders over $75, otherwise $8.99</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                                <h3 className="text-base md:text-lg text-gray-900 font-medium mb-3">Express Shipping</h3>
                                <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed">Delivery within 2-3 business days</p>
                                <p className="text-sm md:text-base text-gray-900 font-semibold">$15.99</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                                <h3 className="text-base md:text-lg text-gray-900 font-medium mb-3">Overnight Shipping</h3>
                                <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed">Next business day delivery</p>
                                <p className="text-sm md:text-base text-gray-900 font-semibold">$25.99</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Processing Time</h2>
                        <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                            Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3-4 business days.
                        </p>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            All orders placed before 2 PM EST on business days will be processed the same day.
                        </p>

                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Shipping Locations</h2>
                        <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                            We currently ship to all 50 United States and Washington D.C. International shipping is available to select countries.
                        </p>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 md:p-6">
                            <p className="text-sm md:text-base text-orange-800">
                                <strong>Note:</strong> Additional customs fees and duties may apply for international orders and are the responsibility of the customer.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Special Care Items</h2>
                        <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                            Our ceramic pieces are carefully packaged with protective materials to ensure they arrive safely. Each item is:
                        </p>
                        <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-2 leading-relaxed">
                            <li>Wrapped in protective bubble wrap</li>
                            <li>Cushioned with eco-friendly packing materials</li>
                            <li>Placed in sturdy shipping boxes</li>
                            <li>Marked as fragile for careful handling</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Order Tracking</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Once your order ships, you'll receive a confirmation email with tracking information. You can track your package using the provided tracking number on our shipping partner's website.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
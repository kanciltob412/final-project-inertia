import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';

export default function ShippingInfo() {
    return (
        <div>
            <Head title="Shipping Information" />
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img src="/craft-1.jpg" alt="Shipping Information" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">SHIPPING INFORMATION</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <div className="space-y-12 md:space-y-14 lg:space-y-16">
                    <section>
                        <h2 className="mb-6 text-lg font-semibold text-gray-900 md:mb-8 md:text-xl lg:text-2xl">Shipping Methods & Costs</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <h3 className="mb-3 text-base font-medium text-gray-900 md:text-lg">Standard Shipping</h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-700 md:text-base">Delivery within 5-7 business days</p>
                                <p className="text-sm font-semibold text-gray-900 md:text-base">Free for orders over $75, otherwise $8.99</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <h3 className="mb-3 text-base font-medium text-gray-900 md:text-lg">Express Shipping</h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-700 md:text-base">Delivery within 2-3 business days</p>
                                <p className="text-sm font-semibold text-gray-900 md:text-base">$15.99</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <h3 className="mb-3 text-base font-medium text-gray-900 md:text-lg">Overnight Shipping</h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-700 md:text-base">Next business day delivery</p>
                                <p className="text-sm font-semibold text-gray-900 md:text-base">$25.99</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Processing Time</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, processing may take
                            up to 3-4 business days.
                        </p>
                        <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                            All orders placed before 2 PM EST on business days will be processed the same day.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Shipping Locations</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We currently ship to all 50 United States and Washington D.C. International shipping is available to select countries.
                        </p>
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 md:p-6">
                            <p className="text-sm text-orange-800 md:text-base">
                                <strong>Note:</strong> Additional customs fees and duties may apply for international orders and are the
                                responsibility of the customer.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Special Care Items</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Our ceramic pieces are carefully packaged with protective materials to ensure they arrive safely. Each item is:
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>Wrapped in protective bubble wrap</li>
                            <li>Cushioned with eco-friendly packing materials</li>
                            <li>Placed in sturdy shipping boxes</li>
                            <li>Marked as fragile for careful handling</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-6 text-3xl font-semibold">Order Tracking</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            Once your order ships, you'll receive a confirmation email with tracking information. You can track your package using the
                            provided tracking number on our shipping partner's website.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

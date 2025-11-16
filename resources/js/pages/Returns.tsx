import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Returns() {
    return (
        <div>
            <Head title="Returns & Exchanges" />
            <Navbar />


            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/craft-2.jpg" alt="Returns & Exchanges" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">RETURNS & EXCHANGES</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-16 px-4">

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Return Policy</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We want you to be completely satisfied with your purchase. If you're not happy with your ceramic piece, you may return it within <strong>30 days</strong> of delivery for a full refund or exchange.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Return Conditions</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">To be eligible for a return, items must meet the following conditions:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Item must be unused and in the same condition as received</li>
                            <li>Item must be in original packaging</li>
                            <li>Return must be initiated within 30 days of delivery</li>
                            <li>Custom or personalized items cannot be returned unless defective</li>
                        </ul>

                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">How to Return an Item</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">1</div>
                                    <h3 className="text-xl font-medium">Contact Us</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">Email us at returns@lavanyaceramics.com or call (555) 123-4567 to initiate your return.</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">2</div>
                                    <h3 className="text-xl font-medium">Receive Authorization</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">We'll provide you with a Return Merchandise Authorization (RMA) number and return instructions.</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">3</div>
                                    <h3 className="text-xl font-medium">Package Securely</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">Pack the item securely in its original packaging with the RMA number clearly marked.</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-semibold">4</div>
                                    <h3 className="text-xl font-medium">Ship the Item</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">Send the item to the address provided in your return authorization.</p>
                            </div>
                        </div>

                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Return Shipping</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Customers are responsible for return shipping costs unless the item was damaged or defective upon arrival. We recommend using a trackable shipping service and purchasing shipping insurance for valuable items.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Refund Processing</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Once we receive and inspect your returned item, we'll notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5-7 business days to your original payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Exchanges</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            If you need to exchange an item for a different size or color, please follow the return process above and place a new order for the desired item. This ensures faster processing of your exchange.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Damaged or Defective Items</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            If your item arrives damaged or defective, please contact us immediately at support@lavanyaceramics.com with photos of the damage. We'll arrange for a replacement or full refund at no cost to you.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';

export default function Returns() {
    return (
        <div>
            <Head title="Returns & Exchanges" />
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img src="/craft-2.jpg" alt="Returns & Exchanges" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">RETURNS & EXCHANGES</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <div className="space-y-12 md:space-y-14 lg:space-y-16">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Return Policy</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We want you to be completely satisfied with your purchase. If you're not happy with your ceramic piece, you may return it
                            within <strong>30 days</strong> of delivery for a full refund or exchange.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Return Conditions</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            To be eligible for a return, items must meet the following conditions:
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>Item must be unused and in the same condition as received</li>
                            <li>Item must be in original packaging</li>
                            <li>Return must be initiated within 30 days of delivery</li>
                            <li>Custom or personalized items cannot be returned unless defective</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-6 text-lg font-semibold text-gray-900 md:mb-8 md:text-xl lg:text-2xl">How to Return an Item</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <div className="mb-3 flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                        1
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 md:text-lg">Contact Us</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                    Email us at info@lavanyaceramics.com or call (+62) 811-129-775 to initiate your return.
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <div className="mb-3 flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                        2
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 md:text-lg">Receive Authorization</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                    We'll provide you with a Return Merchandise Authorization (RMA) number and return instructions.
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <div className="mb-3 flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                        3
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 md:text-lg">Package Securely</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                    Pack the item securely in its original packaging with the RMA number clearly marked.
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                <div className="mb-3 flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                        4
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 md:text-lg">Ship the Item</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                    Send the item to the address provided in your return authorization.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Return Shipping</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Customers are responsible for return shipping costs unless the item was damaged or defective upon arrival. We recommend
                            using a trackable shipping service and purchasing shipping insurance for valuable items.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Refund Processing</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Once we receive and inspect your returned item, we'll notify you of the approval or rejection of your refund. If approved,
                            your refund will be processed within 5-7 business days to your original payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Exchanges</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            If you need to exchange an item for a different size or color, please follow the return process above and place a new
                            order for the desired item. This ensures faster processing of your exchange.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Damaged or Defective Items</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            If your item arrives damaged or defective, please contact us immediately at info@lavanyaceramics.com with photos of the
                            damage. We'll arrange for a replacement or full refund at no cost to you.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

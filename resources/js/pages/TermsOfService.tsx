import { Head } from '@inertiajs/react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function TermsOfService() {
    return (
        <div>
            <Head title="Terms of Service - Lavanya Ceramics" />
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img src="/inspire-3.jpg" alt="Terms of Service" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">TERMS OF SERVICE</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <p className="mb-12 text-center text-sm text-gray-600 md:text-base">Last updated: November 16, 2025</p>

                <div className="space-y-12 md:space-y-14 lg:space-y-16">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Acceptance of Terms</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you
                            do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Use License</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Permission is granted to temporarily download one copy of the materials on Lavanya Ceramics' website for personal,
                            non-commercial transitory viewing only.
                        </p>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Product Information</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            All products are handcrafted ceramic pieces. Each item is unique and may vary slightly from images shown.
                        </p>
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                            <li>Colors may vary due to lighting and screen settings</li>
                            <li>Dimensions are approximate</li>
                            <li>Each piece is unique due to handcrafted nature</li>
                            <li>We reserve the right to correct errors in pricing or product information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Orders and Payment</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            By placing an order, you are making an offer to purchase products subject to these terms and conditions.
                        </p>
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                            <li>We reserve the right to refuse any order</li>
                            <li>Payment must be received before shipment</li>
                            <li>All prices are in Indonesian Rupiah (IDR) and subject to change without notice</li>
                            <li>You are responsible for providing accurate shipping information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Shipping and Delivery</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We ship worldwide using reliable courier services. Delivery times vary by location.
                        </p>
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                            <li>Shipping costs are calculated at checkout</li>
                            <li>International orders may be subject to customs duties</li>
                            <li>We are not responsible for delays caused by customs or force majeure</li>
                            <li>Risk of loss passes to you upon delivery to the carrier</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Returns and Refunds</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return items within 30 days.
                        </p>
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                            <li>Items must be in original condition</li>
                            <li>Custom or personalized items cannot be returned</li>
                            <li>Return shipping costs are the responsibility of the customer</li>
                            <li>Refunds will be processed within 7-10 business days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Limitation of Liability</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            In no event shall Lavanya Ceramics or its suppliers be liable for any damages (including, without limitation, damages for
                            loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on
                            Lavanya Ceramics' website.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Privacy Policy</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you
                            use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Governing Law</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            These terms and conditions are governed by and construed in accordance with the laws of Indonesia and you
                            irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Changes to Terms</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We reserve the right to update these terms at any time. Changes will be effective immediately upon posting on the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Contact Information</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="rounded-lg bg-gray-50 p-4 md:p-6">
                            <p className="text-sm text-gray-700 md:text-base">
                                <strong>Email:</strong> info@lavanyaceramics.com
                                <br />
                                <strong>Phone:</strong> (+62) 811-129-775
                                <br />
                                <strong>Address:</strong> Jl. Sunset road No.22, Seminyak, Bali 80361

                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

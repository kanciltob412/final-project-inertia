import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
    return (
        <div>
            <Head title="Terms of Service - Lavanya Ceramics" />
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/inspire-3.jpg" alt="Terms of Service" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">TERMS OF SERVICE</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-16 px-4">
                <p className="text-gray-600 mb-12 text-center">Last updated: November 16, 2025</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Acceptance of Terms</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Use License</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials on Lavanya Ceramics' website for personal, non-commercial transitory viewing only.
                        </p>
                        <p className="text-gray-700 mb-4 leading-relaxed">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Product Information</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            All products are handcrafted ceramic pieces. Each item is unique and may vary slightly from images shown.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Colors may vary due to lighting and screen settings</li>
                            <li>Dimensions are approximate</li>
                            <li>Each piece is unique due to handcrafted nature</li>
                            <li>We reserve the right to correct errors in pricing or product information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Orders and Payment</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            By placing an order, you are making an offer to purchase products subject to these terms and conditions.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>We reserve the right to refuse any order</li>
                            <li>Payment must be received before shipment</li>
                            <li>All prices are in Indonesian Rupiah (IDR) and subject to change without notice</li>
                            <li>You are responsible for providing accurate shipping information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Shipping and Delivery</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We ship worldwide using reliable courier services. Delivery times vary by location.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Shipping costs are calculated at checkout</li>
                            <li>International orders may be subject to customs duties</li>
                            <li>We are not responsible for delays caused by customs or force majeure</li>
                            <li>Risk of loss passes to you upon delivery to the carrier</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Returns and Refunds</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return items within 30 days.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Items must be in original condition</li>
                            <li>Custom or personalized items cannot be returned</li>
                            <li>Return shipping costs are the responsibility of the customer</li>
                            <li>Refunds will be processed within 7-10 business days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Limitation of Liability</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            In no event shall Lavanya Ceramics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Lavanya Ceramics' website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Privacy Policy</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Governing Law</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Changes to Terms</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We reserve the right to update these terms at any time. Changes will be effective immediately upon posting on the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Contact Information</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-gray-700">
                                <strong>Email:</strong> legal@lavanyaceramics.com<br />
                                <strong>Phone:</strong> (555) 123-4567<br />
                                <strong>Address:</strong> 123 Ceramic Way, Artisan City, AC 12345
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
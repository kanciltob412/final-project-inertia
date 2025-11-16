import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
    return (
        <div>
            <Head title="Privacy Policy" />
            <Navbar />
            
            
            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                                <img src="/inspire-2.jpg" alt="Privacy Policy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">PRIVACY POLICY</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-16 px-4">
                <p className="text-gray-600 mb-12 text-center">Last updated: November 16, 2025</p>
                        
                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Information We Collect</h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Personal information (name, email address, phone number)</li>
                            <li>Billing and shipping addresses</li>
                            <li>Payment information (processed securely by our payment partners)</li>
                            <li>Order history and preferences</li>
                            <li>Communications with our customer service team</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your orders and account</li>
                            <li>Provide customer support</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our products and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Information Sharing</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>With service providers who help us operate our business</li>
                            <li>To comply with legal requirements or protect our rights</li>
                            <li>With your explicit consent</li>
                            <li>In connection with a business transfer or merger</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Data Security</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Your Rights</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">You have the right to:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Access and update your personal information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt out of marketing communications</li>
                            <li>Request a copy of your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Cookies and Tracking</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-gray-700 leading-relaxed">
                                Email: privacy@lavanyaceramics.com<br />
                                Phone: (555) 123-4567<br />
                                Address: 123 Ceramic Way, Artisan City, AC 12345
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
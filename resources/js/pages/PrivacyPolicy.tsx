import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <div>
            <Head title="Privacy Policy" />
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img src="/inspire-2.jpg" alt="Privacy Policy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">PRIVACY POLICY</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <p className="mb-12 text-center text-sm text-gray-600 md:text-base">Last updated: November 16, 2025</p>

                <div className="space-y-12 md:space-y-14 lg:space-y-16">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Information We Collect</h2>
                        <p className="mb-6 text-sm leading-relaxed text-gray-700 md:text-base">
                            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for
                            support.
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>Personal information (name, email address, phone number)</li>
                            <li>Billing and shipping addresses</li>
                            <li>Payment information (processed securely by our payment partners)</li>
                            <li>Order history and preferences</li>
                            <li>Communications with our customer service team</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">How We Use Your Information</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">We use the information we collect to:</p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your orders and account</li>
                            <li>Provide customer support</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our products and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Information Sharing</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We do not sell, trade, or otherwise transfer your personal information to third parties except in the following
                            circumstances:
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>With service providers who help us operate our business</li>
                            <li>To comply with legal requirements or protect our rights</li>
                            <li>With your explicit consent</li>
                            <li>In connection with a business transfer or merger</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Data Security</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration,
                            disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Your Rights</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">You have the right to:</p>
                        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-700 md:text-base">
                            <li>Access and update your personal information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt out of marketing communications</li>
                            <li>Request a copy of your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Cookies and Tracking</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize
                            content. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 md:mb-6 md:text-xl lg:text-2xl">Contact Us</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="rounded-lg bg-gray-50 p-4 md:p-6">
                            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                Email: info@lavanyaceramics.com
                                <br />
                                Phone: (+62) 811-129-775
                                <br />
                                Address: Jl. Sunset road No.22, Seminyak, Bali 80361
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

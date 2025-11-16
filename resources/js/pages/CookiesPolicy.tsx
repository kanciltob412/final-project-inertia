import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookiesPolicy() {
    return (
        <div>
            <Head title="Cookies Policy" />
            <Navbar />


            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/history-plates.jpg" alt="Cookie Policy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">COOKIES POLICY</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-16 px-4">
                <p className="text-gray-600 mb-12 text-center">Last updated: November 16, 2025</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-semibold mb-6">What Are Cookies?</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to the site owners.
                        </p>

                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">How We Use Cookies</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We use cookies to enhance your browsing experience, analyze site traffic, personalize content, and for marketing purposes.
                        </p>

                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Types of Cookies We Use</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and shopping cart functionality.
                                </p>
                                <p className="text-sm text-gray-600">These cookies cannot be disabled.</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-medium mb-3">Performance Cookies</h3>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if they get error messages.
                                </p>
                                <p className="text-sm text-gray-600">This data helps us improve how our website works.</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-medium mb-3">Functionality Cookies</h3>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    These cookies allow the website to remember choices you make (such as your user name, language, or region) and provide enhanced, more personal features.
                                </p>
                                <p className="text-sm text-gray-600">They may also be used to provide services you have asked for.</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-medium mb-3">Targeting/Advertising Cookies</h3>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    These cookies are used to deliver advertisements more relevant to you and your interests. They also help limit the number of times you see an advertisement.
                                </p>
                                <p className="text-sm text-gray-600">They remember that you have visited a website and may share this information with other organizations.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Third-Party Cookies</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We may allow third-party service providers to place cookies on your device to help us analyze website traffic, provide social media features, and deliver targeted advertisements.
                        </p>
                        <p className="text-gray-700 mb-4 leading-relaxed">Third parties that may set cookies on our website include:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Google Analytics (for website analytics)</li>
                            <li>Social media platforms (Facebook, Instagram, Twitter)</li>
                            <li>Payment processors (for secure transactions)</li>
                            <li>Marketing and advertising partners</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Managing Cookies</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Most web browsers allow you to control cookies through their settings preferences. You can:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>View what cookies are stored on your device</li>
                            <li>Delete cookies that are already stored</li>
                            <li>Block cookies from being placed</li>
                            <li>Set preferences for specific websites</li>
                        </ul>
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-orange-800">
                                <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Browser Settings</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            For more information about managing cookies in your specific browser, please visit:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li><a href="https://support.google.com/chrome/answer/95647" className="text-gray-900 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-gray-900 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-gray-900 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" className="text-gray-900 hover:underline" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Updates to This Policy</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We may update this Cookies Policy from time to time. Any changes will be posted on this page with an updated revision date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            If you have any questions about our use of cookies, please contact us:
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
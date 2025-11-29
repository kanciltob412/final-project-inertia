import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head } from '@inertiajs/react';

export default function CookiesPolicy() {
    return (
        <div>
            <Head title="Cookies Policy" />
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img src="/history-plates.jpg" alt="Cookie Policy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">COOKIES POLICY</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <p className="mb-12 text-center text-gray-600">Last updated: November 16, 2025</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">What Are Cookies?</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely
                            used to make websites work more efficiently and provide information to the site owners.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">How We Use Cookies</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            We use cookies to enhance your browsing experience, analyze site traffic, personalize content, and for marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Types of Cookies We Use</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-xl font-medium">Essential Cookies</h3>
                                <p className="mb-3 leading-relaxed text-gray-700">
                                    These cookies are necessary for the website to function properly. They enable basic functions like page
                                    navigation, access to secure areas, and shopping cart functionality.
                                </p>
                                <p className="text-sm text-gray-600">These cookies cannot be disabled.</p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-xl font-medium">Performance Cookies</h3>
                                <p className="mb-3 leading-relaxed text-gray-700">
                                    These cookies collect information about how visitors use our website, such as which pages are visited most often
                                    and if they get error messages.
                                </p>
                                <p className="text-sm text-gray-600">This data helps us improve how our website works.</p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-xl font-medium">Functionality Cookies</h3>
                                <p className="mb-3 leading-relaxed text-gray-700">
                                    These cookies allow the website to remember choices you make (such as your user name, language, or region) and
                                    provide enhanced, more personal features.
                                </p>
                                <p className="text-sm text-gray-600">They may also be used to provide services you have asked for.</p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-3 text-xl font-medium">Targeting/Advertising Cookies</h3>
                                <p className="mb-3 leading-relaxed text-gray-700">
                                    These cookies are used to deliver advertisements more relevant to you and your interests. They also help limit the
                                    number of times you see an advertisement.
                                </p>
                                <p className="text-sm text-gray-600">
                                    They remember that you have visited a website and may share this information with other organizations.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Third-Party Cookies</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            We may allow third-party service providers to place cookies on your device to help us analyze website traffic, provide
                            social media features, and deliver targeted advertisements.
                        </p>
                        <p className="mb-4 leading-relaxed text-gray-700">Third parties that may set cookies on our website include:</p>
                        <ul className="list-inside list-disc space-y-2 leading-relaxed text-gray-700">
                            <li>Google Analytics (for website analytics)</li>
                            <li>Social media platforms (Facebook, Instagram, Twitter)</li>
                            <li>Payment processors (for secure transactions)</li>
                            <li>Marketing and advertising partners</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Managing Cookies</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            Most web browsers allow you to control cookies through their settings preferences. You can:
                        </p>
                        <ul className="list-inside list-disc space-y-2 leading-relaxed text-gray-700">
                            <li>View what cookies are stored on your device</li>
                            <li>Delete cookies that are already stored</li>
                            <li>Block cookies from being placed</li>
                            <li>Set preferences for specific websites</li>
                        </ul>
                        <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <p className="text-orange-800">
                                <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Browser Settings</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            For more information about managing cookies in your specific browser, please visit:
                        </p>
                        <ul className="list-inside list-disc space-y-2 leading-relaxed text-gray-700">
                            <li>
                                <a
                                    href="https://support.google.com/chrome/answer/95647"
                                    className="text-gray-900 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Google Chrome
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                                    className="text-gray-900 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Mozilla Firefox
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                                    className="text-gray-900 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Safari
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies"
                                    className="text-gray-900 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Internet Explorer
                                </a>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Updates to This Policy</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">
                            We may update this Cookies Policy from time to time. Any changes will be posted on this page with an updated revision
                            date.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">Contact Us</h2>
                        <p className="mb-4 leading-relaxed text-gray-700">If you have any questions about our use of cookies, please contact us:</p>
                        <div className="rounded-lg bg-gray-50 p-6">
                            <p className="leading-relaxed text-gray-700">
                                Email: privacy@lavanyaceramics.com
                                <br />
                                Phone: (555) 123-4567
                                <br />
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

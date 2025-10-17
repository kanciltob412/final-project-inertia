import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#423F3B] text-white">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* About Section */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-left text-xl font-bold">
                            {/* Logo before the brand name. Adjust src/alt/size as needed. */}
                            <img src="/LAVANYA_LOGO_WHITE.png" alt="Lavanya Ceramics White Logo" className="h-8 w-auto" />
                        </h3>
                        <p className="mb-4 text-white">
                            Premium ceramics brand offering high-quality tableware and decorative pieces for the modern lifestyle.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white hover:text-gray-400">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white hover:text-gray-400">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white hover:text-gray-400">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-white hover:text-gray-400">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/craftsmanship" className="text-white hover:text-gray-400">
                                    Craftsmanship
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-white hover:text-gray-400">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white hover:text-gray-400">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/articles" className="text-white hover:text-gray-400">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-white hover:text-gray-400">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-gray-400">
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-gray-400">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                <span className="text-white">Jl. Sunset road No.22, Seminyak, Bali 80361</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="mr-2 h-5 w-5" />
                                <span className="text-white">+62 0811-129-775</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-2 h-5 w-5" />
                                <span className="text-white">info@lavanyaceramics.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white pt-8">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-sm text-white">© 2025 LAVANYA CERAMICS. All rights reserved.</p>
                        <div className="mt-4 flex space-x-6 md:mt-0">
                            <a href="#" className="text-sm text-white hover:text-gray-400">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-white hover:text-gray-400">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-white hover:text-gray-400">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

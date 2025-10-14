import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* About Section */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold">APPAREL</h3>
                        <p className="mb-4 text-gray-400">
                            Premium fashion brand offering high-quality clothing and accessories for the modern lifestyle.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-400">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-400">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-400">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-400">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/articles" className="text-gray-400 hover:text-white">
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
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Size Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
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
                                <span className="text-gray-400">123 Fashion Street, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="mr-2 h-5 w-5" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-2 h-5 w-5" />
                                <span className="text-gray-400">contact@apparel.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-sm text-gray-400">© 2024 APPAREL. All rights reserved.</p>
                        <div className="mt-4 flex space-x-6 md:mt-0">
                            <a href="#" className="text-sm text-gray-400 hover:text-white">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-gray-400 hover:text-white">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-gray-400 hover:text-white">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

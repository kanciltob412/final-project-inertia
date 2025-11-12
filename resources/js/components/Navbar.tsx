import { Link, router } from '@inertiajs/react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import { SharedData } from '../types';
import { usePage } from '@inertiajs/react';
import { logout } from '../routes';

interface NavbarProps {
    forceBlack?: boolean;
}

export default function Navbar({ forceBlack = false }: NavbarProps) {
    const user = usePage<SharedData>().props.auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const { items } = useCart();

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Use forceBlack prop to override normal scroll behavior
    const shouldUseBlackStyle = forceBlack || isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        router.post(logout())
    };

    return (
        <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${shouldUseBlackStyle ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src={shouldUseBlackStyle ? "/LAVANYA_LOGO_BLACK.svg" : "/LAVANYA_LOGO_WHITE.svg"}
                                alt="Lavanya Ceramics Logo"
                                className="h-10 w-auto transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <Link href="/" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            Home
                        </Link>
                        <Link href="/about" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            About
                        </Link>
                        <Link href="/craftsmanship" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            Craftsmanship
                        </Link>
                        <Link href="/products" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            Products
                        </Link>
                        <Link href="/articles" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            Articles
                        </Link>
                        <Link href="/contact" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                            Contact
                        </Link>
                        <Link href="/cart" className="relative">
                            <ShoppingCart className={`h-6 w-6 transition-colors ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <>
                                <a href={user.role === 'ADMIN' ? '/admin/dashboard' : '/cart'} className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                                    Hello, {user.name}
                                </a>
                                <div onClick={handleLogout} className={`cursor-pointer transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                                    Logout
                                </div>
                            </>
                        ) : (
                            <Link href="/login" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={shouldUseBlackStyle ? 'text-black' : 'text-white'}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="pb-4 md:hidden">
                        <div className="flex flex-col space-y-4">
                            <Link href="/" className="text-black hover:opacity-75">
                                Home
                            </Link>
                            <Link href="/about" className="text-black hover:opacity-75">
                                About
                            </Link>
                            <Link href="/craftsmanship" className="text-black hover:opacity-75">
                                Craftsmanship
                            </Link>
                            <Link href="/products" className="text-black hover:opacity-75">
                                Products
                            </Link>
                            <Link href="/articles" className="text-black hover:opacity-75">
                                Articles
                            </Link>
                            <Link href="/contact" className="text-black hover:opacity-75">
                                Contact
                            </Link>
                            <Link href="/cart" className="flex items-center text-black hover:opacity-75">
                                <ShoppingCart className="mr-2 h-6 w-6" />
                                <span>Cart ({totalItems})</span>
                            </Link>
                            <Link href="/login" className="text-black hover:opacity-75">
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

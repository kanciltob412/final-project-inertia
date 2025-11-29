import { dashboard, logout } from '@/routes';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';

interface NavbarProps {
    forceBlack?: boolean;
}

export default function Navbar({ forceBlack = false }: NavbarProps) {
    const user = usePage<SharedData>().props.auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const { items, emptyCart } = useCart();

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

    useEffect(() => {
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        // Clear cart items when user logs out
        emptyCart();
        router.post(logout());
    };

    return (
        <nav
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${shouldUseBlackStyle ? 'bg-white shadow-md' : 'bg-transparent'} w-full`}
        >
            <div className="mx-auto w-full max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src={shouldUseBlackStyle ? '/LAVANYA_LOGO_BLACK.svg' : '/LAVANYA_LOGO_WHITE.svg'}
                                alt="Lavanya Ceramics Logo"
                                className="h-10 w-auto transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden items-center space-x-8 lg:flex">
                        <Link
                            href="/"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            HOME
                        </Link>
                        <Link
                            href="/about"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            ABOUT
                        </Link>
                        <Link
                            href="/craftsmanship"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            CRAFTMANSHIP
                        </Link>
                        <Link
                            href="/products"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            PRODUCTS
                        </Link>
                        <Link
                            href="/articles"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            ARTICLES
                        </Link>
                        <Link
                            href="/contact"
                            className={`capitalize transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                        >
                            CONTACT
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
                                {user.role === 'ADMIN' ? (
                                    <>
                                        <Link
                                            href={dashboard()}
                                            className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                                            prefetch
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <div
                                            onClick={handleLogout}
                                            className={`cursor-pointer transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                                        >
                                            Logout
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/customer/dashboard"
                                            className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                                            prefetch
                                        >
                                            Hello, {user.name}
                                        </Link>
                                        <div
                                            onClick={handleLogout}
                                            className={`cursor-pointer transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                                        >
                                            Logout
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <Link href="/login" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={shouldUseBlackStyle ? 'text-black' : 'text-white'}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        className="bg-opacity-100 fixed inset-0 overflow-x-hidden overflow-y-auto bg-white pt-16 pb-6 shadow-xl lg:hidden"
                        style={{ top: '64px', maxHeight: 'calc(100vh - 64px)' }}
                    >
                        <div className="flex max-w-full flex-col space-y-4 px-6">
                            <Link href="/" className="text-black hover:opacity-75">
                                HOME
                            </Link>
                            <Link href="/about" className="text-black hover:opacity-75">
                                ABOUT
                            </Link>
                            <Link href="/craftsmanship" className="text-black hover:opacity-75">
                                CRAFTMANSHIP
                            </Link>
                            <Link href="/products" className="text-black hover:opacity-75">
                                PRODUCTS
                            </Link>
                            <Link href="/articles" className="text-black hover:opacity-75">
                                ARTICLES
                            </Link>
                            <Link href="/contact" className="text-black hover:opacity-75">
                                CONTACT
                            </Link>
                            <Link href="/cart" className="flex items-center text-black hover:opacity-75">
                                <ShoppingCart className="mr-2 h-6 w-6" />
                                <span>Cart ({totalItems})</span>
                            </Link>
                            {user ? (
                                <>
                                    <div className="border-t pt-4">
                                        <p className="mb-3 font-semibold text-black">Hello, {user.name}</p>
                                        {user.role === 'ADMIN' ? (
                                            <Link
                                                href={dashboard()}
                                                className="mb-3 block rounded bg-black p-2 text-center text-sm text-white transition-colors hover:bg-gray-800"
                                                prefetch
                                            >
                                                Admin Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <div className="mb-3 space-y-2">
                                                    <Link
                                                        href="/customer/dashboard"
                                                        className="block rounded bg-gray-100 p-2 text-sm text-black transition-colors hover:bg-gray-200"
                                                    >
                                                        My Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/customer/orders"
                                                        className="block rounded bg-gray-100 p-2 text-sm text-black transition-colors hover:bg-gray-200"
                                                    >
                                                        My Orders
                                                    </Link>
                                                    <Link
                                                        href="/customer/wishlists"
                                                        className="flex items-center gap-2 rounded bg-gray-100 p-2 text-sm text-black transition-colors hover:bg-gray-200"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                        Wishlist
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div onClick={handleLogout} className="cursor-pointer border-t pt-4 text-black hover:opacity-75">
                                        Logout
                                    </div>
                                </>
                            ) : (
                                <Link href="/login" className="text-black hover:opacity-75">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

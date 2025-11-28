import { Link, router, usePage } from '@inertiajs/react';
import { Menu, ShoppingCart, X, ChevronDown, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import axios from 'axios';
import { SharedData } from '@/types';
import { logout, dashboard } from '@/routes';

interface NavbarProps {
    forceBlack?: boolean;
}

export default function Navbar({ forceBlack = false }: NavbarProps) {
    const user = usePage<SharedData>().props.auth.user;
    const userOrders = usePage<SharedData>().props.userOrders || [];
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loadingWishlist, setLoadingWishlist] = useState<boolean>(false);
    const { items, emptyCart } = useCart();

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Use forceBlack prop to override normal scroll behavior
    const shouldUseBlackStyle = forceBlack || isScrolled;

    const loadWishlist = async () => {
        if (!user) return;
        setLoadingWishlist(true);
        try {
            const response = await axios.get('/api/wishlist');
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleTabChange = (tab: 'orders' | 'wishlist') => {
        setActiveTab(tab);
        // Always reload wishlist when switching to the wishlist tab
        if (tab === 'wishlist') {
            loadWishlist();
        }
    };

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
        <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${shouldUseBlackStyle ? 'bg-white shadow-md' : 'bg-transparent'} w-full`}>
            <div className="mx-auto max-w-7xl px-4 w-full">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center flex-1">
                        <Link href="/" className="flex items-center">
                            <img
                                src={shouldUseBlackStyle ? "/LAVANYA_LOGO_BLACK.svg" : "/LAVANYA_LOGO_WHITE.svg"}
                                alt="Lavanya Ceramics Logo"
                                className="h-10 w-auto transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden items-center space-x-8 lg:flex">
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
                                {user.role === 'ADMIN' ? (
                                    <>
                                        <Link href={dashboard()} className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`} prefetch>
                                            Admin Dashboard
                                        </Link>
                                        <div onClick={handleLogout} className={`cursor-pointer transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
                                            Logout
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/customer/dashboard" className={`transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`} prefetch>
                                            Hello, {user.name}
                                        </Link>
                                        <div onClick={handleLogout} className={`cursor-pointer transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}>
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
                    <div className="fixed inset-0 pt-16 pb-6 lg:hidden bg-white bg-opacity-100 shadow-xl overflow-y-auto overflow-x-hidden" style={{ top: '64px', maxHeight: 'calc(100vh - 64px)' }}>
                        <div className="flex flex-col space-y-4 px-6 max-w-full">
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
                            {user ? (
                                <>
                                    <div className="border-t pt-4">
                                        <p className="font-semibold text-black mb-3">Hello, {user.name}</p>
                                        {user.role === 'ADMIN' ? (
                                            <Link href={dashboard()} className="block p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm text-center mb-3" prefetch>
                                                Admin Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <div className="space-y-2 mb-3">
                                                    <Link
                                                        href="/customer/dashboard"
                                                        className="block p-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors text-sm"
                                                    >
                                                        My Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/customer/orders"
                                                        className="block p-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors text-sm"
                                                    >
                                                        My Orders
                                                    </Link>
                                                    <Link
                                                        href="/customer/wishlists"
                                                        className="flex items-center gap-2 p-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors text-sm"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                        Wishlist
                                                    </Link>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                    <div onClick={handleLogout} className="cursor-pointer text-black hover:opacity-75 border-t pt-4">
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

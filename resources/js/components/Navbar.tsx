import { Link, router, usePage } from '@inertiajs/react';
import { Menu, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import { SharedData } from '@/types';
import { logout } from '@/routes';

interface NavbarProps {
    forceBlack?: boolean;
}

export default function Navbar({ forceBlack = false }: NavbarProps) {
    const user = usePage<SharedData>().props.auth.user;
    const userOrders = usePage<SharedData>().props.userOrders || [];
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isOrderMenuOpen, setIsOrderMenuOpen] = useState<boolean>(false);
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

    const handleLogout = () => {
        // Clear cart items when user logs out
        emptyCart();
        router.post(logout());
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
                                <div className="relative">
                                    <button
                                        onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
                                        className={`flex items-center gap-1 transition-colors hover:opacity-75 ${shouldUseBlackStyle ? 'text-black' : 'text-white'}`}
                                    >
                                        Hello, {user.name}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {isOrderMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg z-50">
                                            <div className="p-4 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-900">Your Orders</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {userOrders && userOrders.length > 0 ? (
                                                    <div className="divide-y">
                                                        {userOrders.map((order: any) => (
                                                            <Link
                                                                key={order.id}
                                                                href={`/orders/${order.id}`}
                                                                className="block p-4 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="font-medium text-gray-900">Order #{order.id}</span>
                                                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600">Rp {order.total?.toLocaleString('id-ID')}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-6 text-center">
                                                        <p className="text-gray-600 mb-3">You have not made any orders yet</p>
                                                        <Link href="/products" className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm">
                                                            Go to Shopping
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                            {user ? (
                                <>
                                    <div className="border-t pt-4">
                                        <p className="font-semibold text-black mb-3">Hello, {user.name}</p>
                                        {userOrders && userOrders.length > 0 ? (
                                            <div className="space-y-2 mb-3">
                                                <p className="text-sm text-gray-600 font-medium">Your Orders:</p>
                                                {userOrders.map((order: any) => (
                                                    <Link
                                                        key={order.id}
                                                        href={`/orders/${order.id}`}
                                                        className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{order.status}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Rp {order.total?.toLocaleString('id-ID')}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="mb-3 p-3 bg-gray-50 rounded">
                                                <p className="text-sm text-gray-600 mb-2">You have not made any orders yet</p>
                                                <Link href="/products" className="inline-block text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                                                    Go to Shopping
                                                </Link>
                                            </div>
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

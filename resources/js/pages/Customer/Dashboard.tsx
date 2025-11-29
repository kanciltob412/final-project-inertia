import ContentCarousel from '@/components/content-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerLayout from '@/layouts/customer-layout';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { Heart, MapPin, ShoppingBag } from 'lucide-react';

interface ContentItem {
    id: number;
    type: string;
    title: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    content?: string;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
    display_order: number;
}

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    stats: {
        totalOrders: number;
        totalWishlist: number;
        totalAddresses: number;
    };
    recentOrders: Array<Order>;
    dashboardContent?: ContentItem[];
}

export default function Dashboard({ user, stats, recentOrders, dashboardContent = [] }: DashboardProps) {
    // Debug log
    console.log('Dashboard Content:', dashboardContent);
    return (
        <CustomerLayout title="Customer Dashboard">
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                >
                    ← Back to Home
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Welcome back, {user.name}!</h1>
                    <p className="text-gray-600">Manage your orders, addresses, and wishlist all in one place</p>
                </div>

                {/* Content Carousel Slider */}
                {dashboardContent && dashboardContent.length > 0 && <ContentCarousel items={dashboardContent} />}

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/customer/orders">
                        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                                <p className="text-xs text-gray-500">View all orders</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/customer/wishlists">
                        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                                <Heart className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalWishlist}</div>
                                <p className="text-xs text-gray-500">Saved items</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/customer/addresses">
                        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Addresses</CardTitle>
                                <MapPin className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalAddresses}</div>
                                <p className="text-xs text-gray-500">Saved addresses</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Orders Section */}
                <div>
                    <div className="mb-4">
                        <h2 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">Recent Orders</h2>
                        <p className="text-sm text-gray-600">Track and manage your latest purchases</p>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div>
                            <div className="mb-4 space-y-4">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <Card key={order.id}>
                                        <CardContent className="pt-6">
                                            <div className="grid gap-4 md:grid-cols-4">
                                                {/* Order Number & Date */}
                                                <div>
                                                    <p className="text-sm text-gray-500">Order Number</p>
                                                    <p className="font-semibold">#{order.id}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>

                                                {/* Items Count */}
                                                <div>
                                                    <p className="text-sm text-gray-500">Items</p>
                                                    <p className="font-semibold">{order.items?.length || 0}</p>
                                                </div>

                                                {/* Total */}
                                                <div>
                                                    <p className="text-sm text-gray-500">Total</p>
                                                    <p className="font-bold">Rp {(order.total || 0).toLocaleString('id-ID')}</p>
                                                </div>

                                                {/* Status & Action */}
                                                <div className="flex flex-col items-end justify-between">
                                                    <span
                                                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                                                            order.status === 'DELIVERED'
                                                                ? 'bg-green-100 text-green-800'
                                                                : order.status === 'PENDING'
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : order.status === 'SHIPPED'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()}
                                                    </span>
                                                    <Link href={`/orders/${order.id}`} className="mt-2">
                                                        <Button variant="link" className="h-auto p-0">
                                                            View Details →
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {recentOrders.length > 5 && (
                                <Link href="/customer/orders">
                                    <Button variant="outline" className="w-full md:w-auto">
                                        View All Orders
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <p className="text-gray-500">No orders yet. Start shopping!</p>
                                <Button asChild className="mt-4">
                                    <Link href="/products">Browse Products</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">Update your profile information and preferences</p>
                            <Button asChild variant="outline">
                                <Link href="/customer/profile">Go to Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">Have questions? Contact us for assistance</p>
                            <Button asChild variant="outline">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}

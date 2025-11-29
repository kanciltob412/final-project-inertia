import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    created_at: string;
    status: string;
    total: number;
    items: OrderItem[];
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Stats {
    totalOrders: number;
    totalWishlist: number;
    totalAddresses: number;
    totalSpent: number;
}

interface Props {
    customer: User;
    stats: Stats;
    recentOrders: Order[];
}

export default function CustomerDashboardShow({ customer, stats, recentOrders }: Props) {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Customer Dashboards', href: '/admin/customer-dashboards' },
        { title: customer.name, href: '#' },
    ];

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        // Validation
        if (!password || !passwordConfirmation) {
            setPasswordError('Please fill in all fields');
            return;
        }

        if (password !== passwordConfirmation) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);

        router.post(`/admin/customer-dashboards/${customer.id}/reset-password`, {
            password,
            password_confirmation: passwordConfirmation,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setPassword('');
                setPasswordConfirmation('');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setPasswordError(errors.password || 'Failed to reset password');
                setIsSubmitting(false);
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/admin/customer-dashboards" className="inline-flex items-center">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{customer.name}</h1>
                        </div>
                        <p className="text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-500">Customer since {new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders}</div>
                            <p className="text-xs text-gray-500">view all orders</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                            <Heart className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalWishlist}</div>
                            <p className="text-xs text-gray-500">saved items</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
                            <MapPin className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalAddresses}</div>
                            <p className="text-xs text-gray-500">saved addresses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {stats.totalSpent.toLocaleString('id-ID')}</div>
                            <p className="text-xs text-gray-500">lifetime value</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Recent Orders</h2>
                        <p className="text-gray-600 text-sm">Latest purchases from this customer</p>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <Card key={order.id}>
                                    <CardContent className="pt-6">
                                        <div className="grid gap-4 md:grid-cols-5">
                                            {/* Order Number & Date */}
                                            <div>
                                                <p className="text-sm text-gray-500">Order Number</p>
                                                <p className="font-semibold">#{order.id}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
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

                                            {/* Status */}
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <span
                                                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(
                                                        order.status,
                                                    )}`}
                                                >
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </div>

                                            {/* Action */}
                                            <div className="flex items-end justify-end">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/orders/${order.id}`}>View Details</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <p className="text-gray-500">No orders yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Account Management Section */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Change Password</h2>
                        <p className="text-gray-600 text-sm">Reset customer's password - An email notification will be sent to the customer</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Reset</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                {passwordError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                                        {passwordError}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">New Password</p>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="w-full px-3 py-2 border rounded text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Confirm New Password</p>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full px-3 py-2 border rounded text-sm"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-600 mb-3">Password Requirements:</p>
                                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                                        <li>At least 8 characters long</li>
                                        <li>Contains uppercase and lowercase letters</li>
                                        <li>Contains at least one number</li>
                                    </ul>
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Resetting Password...' : 'Reset Password & Send Email'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

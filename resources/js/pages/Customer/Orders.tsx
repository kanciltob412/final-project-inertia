import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomerLayout from '@/layouts/customer-layout';
import { Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

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
    payment_method?: string;
    shipping_cost?: number;
}

interface Props {
    orders: Order[];
}

export default function Orders({ orders }: Props) {
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
        <CustomerLayout title="My Orders">
            <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
                {/* Back Link */}
                <Link
                    href="/customer/dashboard"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                >
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">My Orders</h1>
                    <p className="text-gray-600">Track and manage all your orders</p>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
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
                                            <p className="font-semibold">{order.items.length} item(s)</p>
                                        </div>

                                        {/* Total Amount */}
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-semibold">Rp {(order.total || 0).toLocaleString('id-ID')}</p>
                                        </div>

                                        {/* Status & Action */}
                                        <div className="flex flex-col items-start justify-between gap-2 md:items-end">
                                            <span className={`rounded px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <Link href={`/orders/${order.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="mt-4 border-t pt-4">
                                        <p className="mb-2 text-sm font-medium text-gray-600">Items:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 normal-case">
                                                    {item.product.name} x{item.quantity}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                                    +{order.items.length - 3} more
                                                </div>
                                            )}
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
                            <p className="mb-4 text-gray-500">No orders yet. Start shopping!</p>
                            <Button asChild>
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CustomerLayout>
    );
}

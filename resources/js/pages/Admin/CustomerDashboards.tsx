import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Order } from '@/types';
import { DollarSign, Heart, ShoppingBag } from 'lucide-react';
import { CustomerDataTable } from './CustomerDashboards/CustomerDataTable';

interface Customer {
    id: number;
    name: string;
    email: string;
    created_at: string;
    total_orders: number;
    total_wishlist: number;
    total_addresses: number;
    total_spent: number;
    recent_order?: Order;
}

interface Props {
    customers: Customer[];
}

export default function CustomerDashboards({ customers }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Customer Dashboards', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Customer Dashboards</h1>
                    <p className="text-gray-600">View and manage customer accounts and their dashboard information</p>
                </div>

                {/* Summary Stats */}
                {customers.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customers.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.total_orders, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Wishlist Items</CardTitle>
                                <Heart className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.total_wishlist, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    Rp {customers.reduce((sum, c) => sum + c.total_spent, 0).toLocaleString('id-ID')}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Separator className="my-8" />

                {/* Customers Table */}
                <CustomerDataTable data={customers} />
            </div>
        </AppLayout>
    );
}

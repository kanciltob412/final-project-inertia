import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatPrice } from '@/utils/helper';
import { Head } from '@inertiajs/react';
import { FileText, FolderOpen, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    totalArticles: number;
    totalOrders: number;
    totalUsers: number;
    recentProducts: Array<{
        id: number;
        name: string;
        category: {
            name: string;
        };
        created_at: string;
    }>;
    recentOrders: Array<{
        id: number;
        user: {
            name: string;
        };
        total: number;
        created_at: string;
    }>;
    monthlyStats: {
        orders: number;
        products: number;
        articles: number;
    };
}

interface Props {
    stats: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ stats }: Props) {
    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Total Categories',
            value: stats.totalCategories,
            icon: FolderOpen,
            bgColor: 'bg-green-500',
        },
        {
            title: 'Total Articles',
            value: stats.totalArticles,
            icon: FileText,
            bgColor: 'bg-purple-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            bgColor: 'bg-orange-500',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            bgColor: 'bg-red-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                    <div className={`rounded-full p-3 ${stat.bgColor}`}>
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Monthly Stats */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <TrendingUp className="h-5 w-5" />
                        This Month's Activity
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.monthlyStats.orders}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">New Orders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.monthlyStats.products}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">New Products</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.monthlyStats.articles}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">New Articles</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Products */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Products</h3>
                        <div className="space-y-3">
                            {stats.recentProducts.length > 0 ? (
                                stats.recentProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 dark:border-gray-700"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 normal-case dark:text-white">{product.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Category: {product.category?.name || 'N/A'}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No products yet</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                        <div className="space-y-3">
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 dark:border-gray-700"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Customer: {order.user?.name || 'Guest'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600 dark:text-green-400">{formatPrice(order.total || 0)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Order } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, User, MapPin, CreditCard, Package, Truck } from "lucide-react";
import HeadingSmall from "@/components/heading-small";
import { formatCurrency } from "@/utils/helper";

interface Props {
    data: Order;
}

export default function Show({ data: order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Orders',
            href: '/admin/orders',
        },
        {
            title: `Order #${order.id}`,
            href: `/admin/orders/${order.id}`,
        },
    ];

    const getStatusColor = (status: string) => {
        const statusConfig = {
            PENDING: 'bg-gray-100 text-gray-800',
            PAID: 'bg-green-100 text-green-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id} Details`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/orders">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Orders
                            </Link>
                        </Button>
                        <HeadingSmall
                            title={`Order #${order.id}`}
                            description={`Created on ${formatDate(order.created_at)}`}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Button asChild>
                            <Link href={`/admin/orders/${order.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Order
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item) => {
                                            const unitPrice = Number(item.price) / Number(item.quantity);
                                            const product = item.product;
                                            let originalUnitPrice = unitPrice;
                                            let discountAmount = 0;

                                            if (product && product.discount && Number(product.discount) > 0) {
                                                if (product.discount_type === 'fixed') {
                                                    originalUnitPrice = unitPrice + Number(product.discount);
                                                    discountAmount = Number(product.discount) * item.quantity;
                                                } else { // percentage
                                                    originalUnitPrice = unitPrice / (1 - Number(product.discount) / 100);
                                                    discountAmount = (originalUnitPrice * item.quantity) - Number(item.price);
                                                }
                                            }

                                            return (
                                                <div key={item.id} className="p-4 border rounded-lg">
                                                    <div className="flex gap-4 mb-3">
                                                        {/* Product Image */}
                                                        {product?.image && (
                                                            <div className="shrink-0">
                                                                <img 
                                                                    src={`/storage/${product.image}`} 
                                                                    alt={product.name}
                                                                    className="w-20 h-20 object-cover rounded"
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Product Info */}
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {item.product?.name || 'Product'}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-sm text-gray-500">
                                                                    SKU: {item.product?.sku || 'N/A'}
                                                                </p>
                                                                {(item.product_variant?.color || item.product?.color) && (
                                                                    <>
                                                                        <span className="text-gray-300">•</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <div
                                                                                className="w-3 h-3 rounded-full border border-gray-300"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        item.product_variant?.color?.toLowerCase() === 'white' ? '#ffffff' :

                                                                                            item.product_variant?.color?.toLowerCase() === 'black' ? '#000000' :
                                                                                                item.product_variant?.color?.toLowerCase() === 'cream' ? '#F5F5DC' :
                                                                                                    item.product_variant?.color?.toLowerCase() === 'brown' ? '#8B4513' :
                                                                                                        item.product_variant?.color?.toLowerCase() === 'gray' ? '#808080' :
                                                                                                            item.product_variant?.color?.toLowerCase() === 'grey' ? '#808080' :
                                                                                                                item.product?.color?.toLowerCase() === 'white' ? '#ffffff' :
                                                                                                                    item.product?.color?.toLowerCase() === 'black' ? '#000000' :
                                                                                                                        item.product?.color?.toLowerCase() === 'cream' ? '#F5F5DC' :
                                                                                                                            item.product?.color?.toLowerCase() === 'brown' ? '#8B4513' :
                                                                                                                                item.product?.color?.toLowerCase() === 'gray' ? '#808080' :
                                                                                                                                    item.product?.color?.toLowerCase() === 'grey' ? '#808080' :
                                                                                                                                        (item.product_variant?.color || item.product?.color || '#e5e7eb')
                                                                }}
                                                                            ></div>
                                                                            <span className="text-sm text-gray-600 capitalize">
                                                                                {item.product_variant?.color || item.product?.color}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-2">Qty: {item.quantity}</div>
                                                        </div>
                                                    </div>

                                                    {/* Price Breakdown */}
                                                    <div className="bg-gray-50 rounded p-3 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Original Price (per unit)</span>
                                                            <span className="font-medium text-gray-900">{formatCurrency(originalUnitPrice)}</span>
                                                        </div>
                                                        {discountAmount > 0 && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Discount</span>
                                                                <span className="font-medium text-red-600">-{formatCurrency(discountAmount)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-sm border-t pt-2">
                                                            <span className="text-gray-600">Total</span>
                                                            <span className="font-semibold text-gray-900">{formatCurrency(Number(item.price))}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No items in this order</p>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    {/* Calculate product discounts */}
                                    {order.items && order.items.length > 0 && (() => {
                                        let totalProductDiscount = 0;
                                        order.items.forEach(item => {
                                            const unitPrice = Number(item.price) / Number(item.quantity);
                                            const product = item.product;
                                            if (product && product.discount && product.discount > 0) {
                                                let discount = 0;
                                                if (product.discount_type === 'fixed') {
                                                    discount = product.discount * item.quantity;
                                                } else { // percentage
                                                    const originalPrice = (unitPrice / (1 - product.discount / 100)) * item.quantity;
                                                    discount = originalPrice - Number(item.price);
                                                }
                                                totalProductDiscount += discount;
                                            }
                                        });
                                        return totalProductDiscount > 0 ? (
                                            <div className="flex justify-between text-blue-600">
                                                <span>Product Discounts</span>
                                                <span>-{formatCurrency(totalProductDiscount)}</span>
                                            </div>
                                        ) : null;
                                    })()}
                                    {order.coupon_discount && order.coupon_discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Coupon Discount</span>
                                            <span>-{formatCurrency(Number(order.coupon_discount))}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                Total: {formatCurrency(Number(order.total))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Information */}
                        {order.status === 'SHIPPED' && order.courier_name && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Truck className="h-5 w-5 mr-2" />
                                        Shipping Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Courier</label>
                                            <p className="text-lg font-semibold">{order.courier_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tracking Number</label>
                                            <p className="text-lg font-semibold">{order.tracking_number}</p>
                                        </div>
                                        {order.shipped_at && (
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-500">Shipped Date</label>
                                                <p className="text-lg font-semibold">{formatDate(order.shipped_at)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Information Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.user ? (
                                    <div className="space-y-2">
                                        <p className="font-semibold">{order.user.name}</p>
                                        <p className="text-gray-600">{order.user.email}</p>
                                        <p className="text-gray-600">{order.phone}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="font-semibold">Guest Customer</p>
                                        <p className="text-gray-600">{order.phone}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <p>{order.address}</p>
                                    <p>{order.city}, {order.postal_code}</p>
                                    <p>{order.country}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</label>
                                        <div className="mt-1">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status === 'PAID' ? 'Paid' : order.status === 'PENDING' ? 'Pending' : order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    {order.payment_method && (
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</label>
                                            <p className="font-medium text-gray-900 mt-1">{order.payment_method}</p>
                                        </div>
                                    )}
                                    {order.payment_channel && (
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Payment Channel</label>
                                            <p className="font-medium text-gray-900 mt-1">{order.payment_channel}</p>
                                        </div>
                                    )}
                                    {order.paid_at && (
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Paid At</label>
                                            <p className="font-medium text-gray-900 mt-1">{formatDate(order.paid_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Order Created</p>
                                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    {order.paid_at && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Payment Confirmed</p>
                                                <p className="text-xs text-gray-500">{formatDate(order.paid_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {order.shipped_at && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Order Shipped</p>
                                                <p className="text-xs text-gray-500">{formatDate(order.shipped_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
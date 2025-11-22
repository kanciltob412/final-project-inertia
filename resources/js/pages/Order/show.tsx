import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Package, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        sku: string;
        image?: string;
        dimension?: string;
        discount?: number;
        discount_type?: 'fixed' | 'percentage';
    };
}

interface OrderData {
    id: number;
    user_id: number;
    status: string;
    total: number;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    phone: string;
    created_at: string;
    items: OrderItem[];
    shipping_cost?: number;
    shipping_courier?: string;
    shipping_service?: string;
    coupon_id?: number;
    coupon_discount?: number;
    coupon?: {
        code: string;
        discount_type: 'fixed' | 'percentage';
        discount_value: number;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export default function OrderShow() {
    const { data: order } = usePage().props as unknown as { data: OrderData };

    if (!order) {
        return (
            <div>
                <Navbar />
                <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                    <h2 className="mb-4 text-2xl font-bold">Order not found</h2>
                    <Link href="/products" className="inline-flex items-center gap-2 text-black hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',
        SHIPPED: 'bg-blue-100 text-blue-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };

    const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';

    // Calculate subtotal from items with product discounts
    const shippingCost = order.shipping_cost || 0;
    const couponDiscount = order.coupon_discount || 0;
    const subtotal = order.items?.reduce((sum, item) => {
        const product = item.product;
        let discountedPrice = item.price;

        if (product?.discount && product.discount > 0) {
            if (product.discount_type === 'percentage') {
                discountedPrice = item.price - (item.price * (product.discount / 100));
            } else {
                discountedPrice = item.price - product.discount;
            }
        }

        return sum + (discountedPrice * item.quantity);
    }, 0) || 0;

    return (
        <>
            <Navbar />

            {/* Black Header Section */}
            <div className="bg-black text-white py-20">
                <div className="mx-auto max-w-4xl px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">Order #{order.id}</h1>
                            <p className="text-gray-300 mt-2">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className={`rounded-lg px-4 py-2 font-semibold ${statusColor}`}>
                            {order.status}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Order Summary */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Shipping Address */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="border rounded-lg p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </h3>
                            <p className="font-semibold">{order.user?.name || 'Guest'}</p>
                            <p className="text-gray-600">{order.address}</p>
                            <p className="text-gray-600">{order.city}, {order.postal_code}</p>
                            <p className="text-gray-600">{order.country}</p>
                            <div className="mt-4 pt-4 border-t space-y-1">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    {order.phone}
                                </div>
                                {order.user?.email && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {order.user.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border rounded-lg p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Package className="h-5 w-5" />
                                Order Items
                            </h3>
                            <div className="space-y-3">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => {
                                        // Calculate discounted price based on product discount
                                        const product = item.product;
                                        let discountAmount = 0;
                                        let discountedPrice = item.price;

                                        if (product?.discount && product.discount > 0) {
                                            if (product.discount_type === 'percentage') {
                                                discountAmount = item.price * (product.discount / 100);
                                            } else {
                                                discountAmount = product.discount;
                                            }
                                            discountedPrice = item.price - discountAmount;
                                        }

                                        const lineTotal = discountedPrice * item.quantity;

                                        return (
                                            <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                                                <div>
                                                    <p className="font-semibold">{product?.name || 'Unknown Product'}</p>
                                                    <p className="text-sm text-gray-600">SKU: {product?.sku || 'N/A'}</p>
                                                    {product?.dimension && (
                                                        <p className="text-sm text-gray-600">Dimension: {product.dimension}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    {discountAmount > 0 && (
                                                        <p className="text-xs text-green-600 font-semibold mt-1">
                                                            {product?.discount_type === 'percentage'
                                                                ? `Product discount: ${product.discount}%`
                                                                : `Product discount: Rp ${discountAmount.toLocaleString('id-ID')}`}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">
                                                        Rp {lineTotal.toLocaleString('id-ID')}
                                                    </p>
                                                    {discountAmount > 0 ? (
                                                        <>
                                                            <p className="text-sm text-gray-500 line-through">
                                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Rp {discountedPrice.toLocaleString('id-ID')} × {item.quantity}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">
                                                            Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500">No items in this order</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-4">
                        <div className="border rounded-lg p-6 bg-gray-50">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <span className="text-xl font-bold">Rp</span>
                                Order Total
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span>
                                        {shippingCost > 0 ? (
                                            <>
                                                <div className="text-right">
                                                    <p className="font-semibold">Rp {shippingCost.toLocaleString('id-ID')}</p>
                                                    {order.shipping_courier && (
                                                        <p className="text-xs text-gray-500">
                                                            {order.shipping_courier.toUpperCase()} - {order.shipping_service}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            'Free'
                                        )}
                                    </span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-green-600">Coupon ({order.coupon?.code}):</span>
                                        <span className="font-semibold text-green-600">-Rp {couponDiscount.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span>Rp {order.total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Info */}
                        <div className="border rounded-lg p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Clock className="h-5 w-5" />
                                Status
                            </h3>
                            <p className={`rounded-lg px-3 py-2 text-center font-semibold ${statusColor}`}>
                                {order.status}
                            </p>
                            <p className="text-sm text-gray-600 mt-3">
                                {order.status === 'PENDING' && 'Your order is awaiting confirmation.'}
                                {order.status === 'COMPLETED' && 'Your order has been confirmed and is being prepared.'}
                                {order.status === 'SHIPPED' && 'Your order is on the way!'}
                                {order.status === 'CANCELLED' && 'This order has been cancelled.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}

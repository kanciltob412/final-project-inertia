import React from "react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Order, Product, User } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Orders",
        href: "/admin/orders",
    },
];

interface Props {
    order?: Order;
    users?: User[];
    products?: Product[];
}

export default function Form({ order, users, products }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        user_id: number | string;
        phone: string;
        address: string;
        city: string;
        country: string;
        postal_code: string;
        status: string;
        total: number | string;
        payment_method: string;
        payment_channel: string;
        url: string;
        items?: {
            product_id: number | string;
            quantity: number | string;
            price: number | string;
        }[] | undefined;
    }>({
        user_id: order ? order.user_id.toString() : "",
        phone: order ? order.phone : "",
        address: order ? order.address : "",
        city: order ? order.city : "",
        country: order ? order.country : "",
        postal_code: order ? order.postal_code : "",
        status: order ? order.status : "pending",
        total: order ? order.total : "",
        payment_method: order ? order.payment_method || "" : "",
        payment_channel: order ? order.payment_channel || "" : "",
        url: order ? order.url || "" : "",
        items: order && order.items ? order.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        })) : undefined,
    });

    // Auto-calculate total when items change
    React.useEffect(() => {
        if (data.items && data.items.length > 0) {
            const newTotal = data.items.reduce((sum, item) => 
                sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0
            );
            if (newTotal !== Number(data.total)) {
                setData('total', newTotal);
            }
        }
    }, [data.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (order) {
            router.post(`/admin/orders/${order.id}`, {
                ...data,
                _method: "put",
            }, {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        } else {
            post("/admin/orders", {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={order ? "Edit Order" : "Create Order"} />

            <div className="p-6">
                <HeadingSmall
                    title={`${order ? "Edit" : "Create"} Order`}
                    description={`Fill out the form below to ${order ? "edit an existing" : "create a new"} order.`}
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Selection */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="user_id">Customer</Label>
                        <Select
                            value={data.user_id.toString()}
                            onValueChange={(value) => setData("user_id", parseInt(value))}
                            disabled={processing}
                        >
                            <SelectTrigger id="user_id">
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && (
                            <p className="text-sm text-red-600">{errors.user_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                disabled={processing}
                                placeholder="+1234567890"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData("city", e.target.value)}
                                disabled={processing}
                                placeholder="City"
                            />
                            {errors.city && (
                                <p className="text-sm text-red-600">{errors.city}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            disabled={processing}
                            placeholder="Full address..."
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Country */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={data.country}
                                onChange={(e) => setData("country", e.target.value)}
                                disabled={processing}
                                placeholder="Country"
                            />
                            {errors.country && (
                                <p className="text-sm text-red-600">{errors.country}</p>
                            )}
                        </div>

                        {/* Postal Code */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input
                                id="postal_code"
                                value={data.postal_code}
                                onChange={(e) => setData("postal_code", e.target.value)}
                                disabled={processing}
                                placeholder="12345"
                            />
                            {errors.postal_code && (
                                <p className="text-sm text-red-600">{errors.postal_code}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="total">Total Amount (Rp)</Label>
                            <Input
                                id="total"
                                type="number"
                                step="0.01"
                                value={data.total}
                                onChange={(e) => setData("total", parseFloat(e.target.value) || 0)}
                                disabled={processing}
                                placeholder="0"
                            />
                            {errors.total && (
                                <p className="text-sm text-red-600">{errors.total}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="status">Order Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) => setData("status", value)}
                                disabled={processing}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Payment Method */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Input
                                id="payment_method"
                                value={data.payment_method}
                                onChange={(e) => setData("payment_method", e.target.value)}
                                disabled={processing}
                                placeholder="Credit Card, Bank Transfer, etc."
                            />
                            {errors.payment_method && (
                                <p className="text-sm text-red-600">{errors.payment_method}</p>
                            )}
                        </div>

                        {/* Payment Channel */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="payment_channel">Payment Channel</Label>
                            <Input
                                id="payment_channel"
                                value={data.payment_channel}
                                onChange={(e) => setData("payment_channel", e.target.value)}
                                disabled={processing}
                                placeholder="Stripe, PayPal, etc."
                            />
                            {errors.payment_channel && (
                                <p className="text-sm text-red-600">{errors.payment_channel}</p>
                            )}
                        </div>
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="url">Payment URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            disabled={processing}
                            placeholder="https://payment-gateway.com/order/123"
                        />
                        {errors.url && (
                            <p className="text-sm text-red-600">{errors.url}</p>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-y-2">
                        <Label>Order Items</Label>
                        {data.items && data.items.length > 0 ? (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                {data.items.map((item, index) => {
                                    const currentProduct = products?.find(p => p.id === Number(item.product_id));
                                    const itemSubtotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
                                    
                                    return (
                                        <div key={index} className="flex items-center gap-4 bg-white p-3 rounded border">
                                            <div className="flex-1">
                                                <Select
                                                    value={item.product_id.toString()}
                                                    onValueChange={(value) => {
                                                        const selectedProduct = products?.find(p => p.id === Number(value));
                                                        const newItems = [...(data.items || [])];
                                                        newItems[index] = {
                                                            ...item,
                                                            product_id: Number(value),
                                                            price: selectedProduct?.price || 0
                                                        };
                                                        setData('items', newItems);
                                                    }}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products?.map((product) => (
                                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                                {product.name} - Rp {product.price.toLocaleString('id-ID')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`quantity-${index}`} className="text-sm whitespace-nowrap">Qty:</Label>
                                                <Input
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newItems = [...(data.items || [])];
                                                        newItems[index] = {
                                                            ...item,
                                                            quantity: Number(e.target.value) || 1
                                                        };
                                                        setData('items', newItems);
                                                    }}
                                                    className="w-20"
                                                    disabled={processing}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`price-${index}`} className="text-sm whitespace-nowrap">Price:</Label>
                                                <Input
                                                    id={`price-${index}`}
                                                    type="number"
                                                    min="0"
                                                    value={item.price}
                                                    onChange={(e) => {
                                                        const newItems = [...(data.items || [])];
                                                        newItems[index] = {
                                                            ...item,
                                                            price: Number(e.target.value) || 0
                                                        };
                                                        setData('items', newItems);
                                                    }}
                                                    className="w-32"
                                                    disabled={processing}
                                                />
                                            </div>

                                            <div className="text-sm font-medium whitespace-nowrap">
                                                Rp {itemSubtotal.toLocaleString('id-ID')}
                                            </div>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    const newItems = data.items?.filter((_, i) => i !== index);
                                                    setData('items', newItems);
                                                }}
                                                disabled={processing}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    );
                                })}
                                
                                {/* Add New Item Button */}
                                <div className="flex justify-between items-center border-t pt-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const newItems = [...(data.items || [])];
                                            newItems.push({
                                                product_id: products?.[0]?.id || 1,
                                                quantity: 1,
                                                price: products?.[0]?.price || 0
                                            });
                                            setData('items', newItems);
                                        }}
                                        disabled={processing || !products?.length}
                                    >
                                        Add Item
                                    </Button>
                                    
                                    <p className="font-semibold text-lg">
                                        Total: Rp {((data.items || []).reduce((sum, item) => 
                                            sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0
                                        )).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-center text-gray-600 mb-4">No items in this order</p>
                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setData('items', [{
                                                product_id: products?.[0]?.id || 1,
                                                quantity: 1,
                                                price: products?.[0]?.price || 0
                                            }]);
                                        }}
                                        disabled={processing || !products?.length}
                                    >
                                        Add First Item
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : (order ? "Update Order" : "Create Order")}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
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
        payment_method: order ? order.payment_method : "",
        payment_channel: order ? order.payment_channel : "",
        url: order ? order.url : "",
        items: order ? order.items : undefined,
    });

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

                    {/* Items */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="items">Order Items</Label>
                        {/* Implement items input logic here as needed */}
                        <div className="flex flex-col gap-y-2">
                            {products?.map((product) => (
                                <div key={product.id} className="flex items-center gap-x-2">
                                    <Checkbox
                                        id={`product-${product.id}`}
                                        checked={data.items?.some((item) => item.product_id === product.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setData("items", [
                                                    ...(data.items || []),
                                                    { product_id: product.id, quantity: 1, price: product.price },
                                                ]);
                                            } else {
                                                setData("items", data.items?.filter((item) => item.product_id !== product.id));
                                            }
                                        }}
                                        disabled={processing}
                                    />
                                    <Label htmlFor={`product-${product.id}`} className="flex-1">
                                        {product.name} - Rp {product.price.toLocaleString('id-ID')}
                                    </Label>
                                </div>
                            ))}
                        </div>
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
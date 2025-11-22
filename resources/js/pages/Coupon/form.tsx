import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Coupon } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Coupons",
        href: "/admin/coupons",
    },
];

interface Props {
    coupon?: Coupon;
}

export default function Form({ coupon }: Props) {
    const { data, setData, processing, errors } = useForm({
        code: coupon?.code || "",
        discount_type: coupon?.discount_type || "fixed",
        discount_value: coupon?.discount_value?.toString() || "",
        expiry_date: coupon?.expiry_date || "",
        usage_limit: coupon?.usage_limit?.toString() || "",
        is_active: coupon?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!data.code.trim()) {
            alert('Coupon code is required');
            return;
        }

        if (!data.discount_value) {
            alert('Discount value is required');
            return;
        }

        // Convert datetime-local format (YYYY-MM-DDTHH:mm) to Y-m-d H:i format
        let formattedExpiryDate = null;
        if (data.expiry_date) {
            const dateObj = new Date(data.expiry_date);
            if (!isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                formattedExpiryDate = `${year}-${month}-${day} ${hours}:${minutes}`;
            }
        }

        const formData = {
            code: data.code,
            discount_type: data.discount_type,
            discount_value: parseFloat(data.discount_value) || 0,
            expiry_date: formattedExpiryDate,
            usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
            is_active: data.is_active,
        };

        console.log('Submitting coupon:', formData);

        if (coupon) {
            router.put(`/admin/coupons/${coupon.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/admin/coupons');
                },
                onError: (errors) => {
                    console.error('Update error:', errors);
                }
            });
        } else {
            router.post('/admin/coupons', formData, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/admin/coupons');
                },
                onError: (errors) => {
                    console.error('Create error:', errors);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={coupon ? "Edit Coupon" : "Create Coupon"} />

            <div className="p-6">
                <HeadingSmall
                    title={`${coupon ? "Edit" : "Create"} Coupon`}
                    description={`Fill out the form below to ${coupon ? "edit an existing" : "create a new"} coupon.`}
                />

                <Separator className="my-8" />

                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-sm text-red-700">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    {/* Code */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="code">Coupon Code *</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value.toUpperCase())}
                            disabled={processing}
                            placeholder="e.g., SAVE20"
                            maxLength={20}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-600">{errors.code}</p>
                        )}
                    </div>

                    {/* Discount Type */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="discount_type">Discount Type *</Label>
                        <Select
                            value={data.discount_type}
                            onValueChange={(value) => setData("discount_type", value as 'fixed' | 'percentage')}
                            disabled={processing}
                        >
                            <SelectTrigger id="discount_type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.discount_type && (
                            <p className="text-sm text-red-600">{errors.discount_type}</p>
                        )}
                    </div>

                    {/* Discount Value */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="discount_value">
                            Discount Value {data.discount_type === 'percentage' ? '(%)' : '(Amount)'} *
                        </Label>
                        <Input
                            id="discount_value"
                            type="number"
                            step="0.01"
                            value={data.discount_value}
                            onChange={(e) => setData("discount_value", e.target.value)}
                            disabled={processing}
                            placeholder={data.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 50000'}
                            min="0"
                        />
                        {errors.discount_value && (
                            <p className="text-sm text-red-600">{errors.discount_value}</p>
                        )}
                    </div>

                    {/* Expiry Date */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="expiry_date">Expiration Date (Optional)</Label>
                        <Input
                            id="expiry_date"
                            type="datetime-local"
                            value={data.expiry_date}
                            onChange={(e) => setData("expiry_date", e.target.value)}
                            disabled={processing}
                        />
                        {errors.expiry_date && (
                            <p className="text-sm text-red-600">{errors.expiry_date}</p>
                        )}
                    </div>

                    {/* Usage Limit */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                        <Input
                            id="usage_limit"
                            type="number"
                            value={data.usage_limit}
                            onChange={(e) => setData("usage_limit", e.target.value)}
                            disabled={processing}
                            placeholder="e.g., 100"
                            min="0"
                        />
                        <p className="text-xs text-gray-500">Leave empty for unlimited uses</p>
                        {errors.usage_limit && (
                            <p className="text-sm text-red-600">{errors.usage_limit}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="is_active">Status</Label>
                        <Select
                            value={data.is_active ? "true" : "false"}
                            onValueChange={(value) => setData("is_active", value === "true")}
                            disabled={processing}
                        >
                            <SelectTrigger id="is_active">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.is_active && (
                            <p className="text-sm text-red-600">{errors.is_active}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.location.href = '/admin/coupons'}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {coupon ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

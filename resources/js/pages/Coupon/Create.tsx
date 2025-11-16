import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import HeadingSmall from '@/components/heading-small';
import { BreadcrumbItem } from '@/types';

export default function CouponCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        discount_type: 'fixed',
        discount_value: '',
        usage_limit: '',
        expiry_date: '',
        is_active: true,
    });

    const [discountPreview, setDiscountPreview] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Coupons",
            href: "/admin/coupons",
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/coupons');
    };

    const handleDiscountChange = (value: string) => {
        setData('discount_value', value);
        if (value) {
            if (data.discount_type === 'fixed') {
                setDiscountPreview(`Rp ${parseInt(value).toLocaleString('id-ID')}`);
            } else {
                setDiscountPreview(`${value}%`);
            }
        }
    };

    const handleTypeChange = (type: string) => {
        setData('discount_type', type as 'fixed' | 'percentage');
        if (data.discount_value) {
            if (type === 'fixed') {
                setDiscountPreview(`Rp ${parseInt(data.discount_value).toLocaleString('id-ID')}`);
            } else {
                setDiscountPreview(`${data.discount_value}%`);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Coupon" />

            <div className="p-6">
                <HeadingSmall
                    title="Create Coupon"
                    description="Fill out the form below to create a new discount coupon."
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Coupon Code */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="code">Coupon Code</Label>
                        <Input
                            id="code"
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            placeholder="e.g., SUMMER20"
                            disabled={processing}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-600">{errors.code}</p>
                        )}
                    </div>

                    {/* Discount Type and Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="discount_type">Discount Type</Label>
                            <select
                                id="discount_type"
                                value={data.discount_type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                disabled={processing}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="fixed">Fixed Amount (Rp)</option>
                                <option value="percentage">Percentage (%)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="discount_value">Discount Value</Label>
                            <Input
                                id="discount_value"
                                type="number"
                                value={data.discount_value}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                placeholder={data.discount_type === 'fixed' ? 'e.g., 50000' : 'e.g., 20'}
                                step="0.01"
                                min="0.01"
                                disabled={processing}
                            />
                            {discountPreview && (
                                <p className="text-sm text-gray-600">
                                    Preview: <span className="font-semibold text-green-600">{discountPreview}</span>
                                </p>
                            )}
                            {errors.discount_value && (
                                <p className="text-sm text-red-600">{errors.discount_value}</p>
                            )}
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                        <Input
                            id="usage_limit"
                            type="number"
                            value={data.usage_limit}
                            onChange={(e) => setData('usage_limit', e.target.value)}
                            placeholder="e.g., 100 (leave empty for unlimited)"
                            min="1"
                            disabled={processing}
                        />
                        <p className="text-xs text-gray-500">
                            Leave empty for unlimited uses
                        </p>
                        {errors.usage_limit && (
                            <p className="text-sm text-red-600">{errors.usage_limit}</p>
                        )}
                    </div>

                    {/* Expiry Date */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData('expiry_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={processing}
                        />
                        <p className="text-xs text-gray-500">
                            Leave empty to never expire
                        </p>
                        {errors.expiry_date && (
                            <p className="text-sm text-red-600">{errors.expiry_date}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            disabled={processing}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_active" className="mb-0">Active</Label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create Coupon'}
                        </Button>
                        <Link href="/admin/coupons">
                            <Button variant="outline" disabled={processing}>Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

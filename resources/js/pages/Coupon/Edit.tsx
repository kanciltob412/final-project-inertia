import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface Coupon {
    id: number;
    code: string;
    discount_type: 'fixed' | 'percentage';
    discount_value: number;
    usage_limit: number | null;
    used_count: number;
    expiry_date: string | null;
    is_active: boolean;
}

interface Props {
    coupon: Coupon;
}

export default function CouponEdit({ coupon }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value.toString(),
        usage_limit: coupon.usage_limit?.toString() || '',
        expiry_date: coupon.expiry_date
            ? format(new Date(coupon.expiry_date), 'yyyy-MM-dd')
            : '',
        is_active: coupon.is_active,
    });

    const [discountPreview, setDiscountPreview] = useState(
        coupon.discount_type === 'fixed'
            ? `Rp ${coupon.discount_value.toLocaleString('id-ID')}`
            : `${coupon.discount_value}%`
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.coupons.update', coupon.id));
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
        <AdminLayout>
            <Head title="Edit Coupon" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Coupon</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Used: <span className="font-semibold">{coupon.used_count}</span>
                        {coupon.usage_limit && ` of ${coupon.usage_limit}`}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Coupon Code */}
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon Code
                        </label>
                        <Input
                            id="code"
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            placeholder="e.g., SUMMER20"
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        {errors.code && (
                            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                        )}
                    </div>

                    {/* Discount Type and Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Type
                            </label>
                            <select
                                id="discount_type"
                                value={data.discount_type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="fixed">Fixed Amount (Rp)</option>
                                <option value="percentage">Percentage (%)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Value
                            </label>
                            <div className="space-y-2">
                                <Input
                                    id="discount_value"
                                    type="number"
                                    value={data.discount_value}
                                    onChange={(e) => handleDiscountChange(e.target.value)}
                                    placeholder={data.discount_type === 'fixed' ? 'e.g., 50000' : 'e.g., 20'}
                                    step="0.01"
                                    min="0.01"
                                    className={errors.discount_value ? 'border-red-500' : ''}
                                />
                                {discountPreview && (
                                    <p className="text-sm text-gray-600">
                                        Preview: <span className="font-semibold text-green-600">{discountPreview}</span>
                                    </p>
                                )}
                            </div>
                            {errors.discount_value && (
                                <p className="mt-1 text-sm text-red-600">{errors.discount_value}</p>
                            )}
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 mb-2">
                            Usage Limit (Optional)
                        </label>
                        <Input
                            id="usage_limit"
                            type="number"
                            value={data.usage_limit}
                            onChange={(e) => setData('usage_limit', e.target.value)}
                            placeholder="e.g., 100 (leave empty for unlimited)"
                            min="1"
                            className={errors.usage_limit ? 'border-red-500' : ''}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Leave empty for unlimited uses. Current usage: {coupon.used_count}
                        </p>
                        {errors.usage_limit && (
                            <p className="mt-1 text-sm text-red-600">{errors.usage_limit}</p>
                        )}
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date (Optional)
                        </label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData('expiry_date', e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className={errors.expiry_date ? 'border-red-500' : ''}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Leave empty to never expire
                        </p>
                        {errors.expiry_date && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Updating...' : 'Update Coupon'}
                        </Button>
                        <Link href={route('admin.coupons.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

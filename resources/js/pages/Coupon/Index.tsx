import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/Pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertCircle, Trash2 } from 'lucide-react';

interface Coupon {
    id: number;
    code: string;
    discount_type: 'fixed' | 'percentage';
    discount_value: number;
    usage_limit: number | null;
    used_count: number;
    expiry_date: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    coupons: {
        data: Coupon[];
        links: any;
        meta: any;
    };
}

export default function CouponIndex({ coupons }: Props) {
    const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(route('admin.coupons.destroy', id));
        }
    };

    const toggleSelectCoupon = (id: number) => {
        setSelectedCoupons((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCoupons.length === coupons.data.length) {
            setSelectedCoupons([]);
        } else {
            setSelectedCoupons(coupons.data.map((c) => c.id));
        }
    };

    const formatDiscount = (type: string, value: number) => {
        if (type === 'fixed') {
            return `Rp ${value.toLocaleString('id-ID')}`;
        } else {
            return `${value}%`;
        }
    };

    const isExpired = (expiryDate: string | null) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const canBeUsed = (coupon: Coupon) => {
        if (!coupon.is_active) return false;
        if (isExpired(coupon.expiry_date)) return false;
        if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
            return false;
        }
        return true;
    };

    return (
        <AdminLayout>
            <Head title="Coupons" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage discount coupons for your store
                        </p>
                    </div>
                    <Link href={route('admin.coupons.create')}>
                        <Button>Create Coupon</Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedCoupons.length === coupons.data.length &&
                                            coupons.data.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center">
                                        <p className="text-gray-500">No coupons found</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.data.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={selectedCoupons.includes(coupon.id)}
                                                onChange={() => toggleSelectCoupon(coupon.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono font-semibold">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell>
                                            {formatDiscount(coupon.discount_type, coupon.discount_value)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{coupon.used_count} used</div>
                                                {coupon.usage_limit && (
                                                    <div className="text-gray-500">
                                                        of {coupon.usage_limit}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {coupon.expiry_date ? (
                                                <div className="text-sm">
                                                    {format(new Date(coupon.expiry_date), 'MMM dd, yyyy')}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No expiry</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {!coupon.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                        Inactive
                                                    </span>
                                                ) : isExpired(coupon.expiry_date) ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Expired
                                                    </span>
                                                ) : coupon.usage_limit !== null &&
                                                  coupon.used_count >= coupon.usage_limit ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Limit Reached
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.coupons.edit', coupon.id)}
                                                    className="text-sm text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="text-sm text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {coupons.meta?.last_page > 1 && (
                    <Pagination links={coupons.links} meta={coupons.meta} />
                )}
            </div>
        </AdminLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

export default function CouponIndex() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Coupons', href: '/admin/coupons' }]}>
            <Head title="Coupons" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Coupons</h1>
                    <Link href="/admin/coupons/create" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Create Coupon</Link>
                </div>
                {/* Coupon list table goes here */}
                <div className="bg-white rounded shadow p-4 text-center text-gray-500">No coupons found.</div>
            </div>
        </AppLayout>
    );
}

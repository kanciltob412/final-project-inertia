interface Coupon {
    id: number;
    code: string;
    discount: number;
    expires_at: string;
}
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CouponEdit() {
    const { coupon } = usePage().props as unknown as { coupon: Coupon };
    const { data, setData, post, processing, errors } = useForm<{
        code: string;
        discount: string;
        expires_at: string;
    }>({
        code: coupon.code || '',
        discount: coupon.discount ? String(coupon.discount) : '',
        expires_at: coupon.expires_at || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/coupons/${coupon.id}`, { preserveScroll: true, method: 'put' });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Coupons', href: '/admin/coupons' }, { title: 'Edit', href: `/admin/coupons/${coupon.id}/edit` }]}>
            <Head title="Edit Coupon" />
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Coupon</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" value={data.code} onChange={e => setData('code', e.target.value)} disabled={processing} />
                        {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                    </div>
                    <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input id="discount" type="number" value={data.discount} onChange={e => setData('discount', e.target.value)} disabled={processing} />
                        {errors.discount && <p className="text-sm text-red-600">{errors.discount}</p>}
                    </div>
                    <div>
                        <Label htmlFor="expires_at">Expires At</Label>
                        <Input id="expires_at" type="date" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} disabled={processing} />
                        {errors.expires_at && <p className="text-sm text-red-600">{errors.expires_at}</p>}
                    </div>
                    <Button type="submit" disabled={processing}>Update Coupon</Button>
                </form>
            </div>
        </AppLayout>
    );
}

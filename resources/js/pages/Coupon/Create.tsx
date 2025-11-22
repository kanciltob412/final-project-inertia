import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CouponCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        discount: '',
        expires_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/coupons', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Coupons', href: '/admin/coupons' }, { title: 'Create', href: '/admin/coupons/create' }]}>
            <Head title="Create Coupon" />
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create Coupon</h1>
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
                    <Button type="submit" disabled={processing}>Create Coupon</Button>
                </form>
            </div>
        </AppLayout>
    );
}

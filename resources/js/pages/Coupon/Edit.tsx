import { Coupon } from '@/types';
import { usePage } from '@inertiajs/react';
import Form from './form';

export default function Edit() {
    const { coupon } = usePage().props as unknown as { coupon: Coupon };
    return <Form coupon={coupon} />;
}

import Form from "./form";
import { Coupon } from "@/types";
import { usePage } from "@inertiajs/react";

export default function Edit() {
    const { coupon } = usePage().props as unknown as { coupon: Coupon };
    return <Form coupon={coupon} />;
}

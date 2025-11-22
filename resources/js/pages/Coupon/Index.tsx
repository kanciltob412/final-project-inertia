import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Coupon } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { CouponDataTable } from "./CouponDataTable";
import { Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Coupons",
        href: "/admin/coupons",
    },
];

interface Props {
    coupons: Coupon[];
}

export default function CouponIndex({ coupons }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Coupons" />

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Coupons"
                        description="Manage promotional coupons and discount codes."
                    />
                    <Button
                        onClick={() => router.visit('/admin/coupons/create')}
                        className="bg-black hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Coupon
                    </Button>
                </div>

                <Separator className="my-8" />

                <CouponDataTable data={coupons} />
            </div>
        </AppLayout>
    );
}

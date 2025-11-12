import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Order } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { OrderDataTable } from "./OrderDataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./column";
import HeadingSmall from "@/components/heading-small";
import orders from "../../routes/orders";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

interface Props {
    data: Order[]
}

export default function Index({ data }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders List" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Orders List"
                        description="Manage your orders here"
                    />
                    <Button asChild>
                        <Link href={orders.create().url}>
                            <Plus className="size-4" />
                            Create Order
                        </Link>
                    </Button>
                </div>

                <OrderDataTable columns={columns} data={data} />
            </div>

        </AppLayout>
    );
}
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";

import { Order } from '@/types';

interface Customer {
    id: number;
    name: string;
    email: string;
    created_at: string;
    total_orders: number;
    total_wishlist: number;
    total_addresses: number;
    total_spent: number;
    recent_order?: Order;
}

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-gray-600">{row.original.email}</span>
        ),
    },
    {
        accessorKey: "total_orders",
        header: "Orders",
        cell: ({ row }) => (
            <div className="text-center">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {row.original.total_orders}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "total_wishlist",
        header: "Wishlist",
        cell: ({ row }) => (
            <div className="text-center">
                <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                    {row.original.total_wishlist}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "total_addresses",
        header: "Addresses",
        cell: ({ row }) => (
            <div className="text-center">
                <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {row.original.total_addresses}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "total_spent",
        header: "Total Spent",
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">
                Rp {row.original.total_spent.toLocaleString('id-ID')}
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <span className="text-gray-600">
                    {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
            <Button asChild size="sm" variant="outline">
                <Link href={`/admin/customer-dashboards/${row.original.id}`}>
                    View
                </Link>
            </Button>
        ),
    },
];

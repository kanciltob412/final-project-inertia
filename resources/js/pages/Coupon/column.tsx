import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Coupon } from "@/types";

function ActionsCell({ coupon }: { coupon: Coupon }) {
    const [open, setOpen] = useState(false);

    const handleEdit = () => {
        router.visit(`/admin/coupons/${coupon.id}/edit`);
    };

    const handleDelete = () => {
        router.delete(`/admin/coupons/${coupon.id}`);
        setOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setTimeout(() => {
                                setOpen(true);
                            }, 50);
                        }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete coupon <strong>{coupon.code}</strong> permanently.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export const columns: ColumnDef<Coupon>[] = [
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
        size: 40,
    },
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-black">
                {row.original.code}
            </span>
        ),
    },
    {
        accessorKey: "discount_type",
        header: "Type",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.discount_type === 'percentage'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
                }`}>
                {row.original.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
            </span>
        ),
    },
    {
        accessorKey: "discount_value",
        header: "Discount Value",
        cell: ({ row }) => (
            <span className="font-semibold">
                {row.original.discount_type === 'percentage'
                    ? `${row.original.discount_value}%`
                    : `Rp ${Number(row.original.discount_value).toLocaleString()}`}
            </span>
        ),
    },
    {
        accessorKey: "used_count",
        header: "Used / Limit",
        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.used_count} {row.original.usage_limit ? `/ ${row.original.usage_limit}` : '/ Unlimited'}
            </span>
        ),
    },
    {
        accessorKey: "expiry_date",
        header: "Expires",
        cell: ({ row }) => {
            if (!row.original.expiry_date) {
                return <span className="text-gray-500">Never</span>;
            }
            const expiryDate = new Date(row.original.expiry_date);
            const isExpired = expiryDate < new Date();
            return (
                <span className={isExpired ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                    {expiryDate.toLocaleDateString('id-ID')}
                </span>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {row.original.is_active ? 'Active' : 'Inactive'}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell coupon={row.original} />,
    },
];

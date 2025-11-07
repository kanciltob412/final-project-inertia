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
import { Order } from "@/types";
import orders from "../../routes/orders";

function ActionsCell({ order }: { order: Order }) {
    const [open, setOpen] = useState(false);

    const handleEdit = () => {
        router.visit(orders.edit(order.id));
    };

    const handleDelete = () => {
        router.delete(orders.destroy(order.id));
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
                            This will delete <strong>{order.id}</strong> permanently.
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

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "user.name",
        header: "Customer Name",
    },
    {        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "postal_code",
        header: "Postal Code",
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
            const order = row.original; 
            if (!order.items || order.items.length === 0) {
                return <div>No items</div>;
            }
            return ( 
            <div>
                {order.items.map((item) => {
                    return (
                        <div key={item.id}>
                            {item.product?.name} X {item.quantity}
                        </div>
                    );
                })}
            </div>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.total)}</span>,  
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <div>No items</div>;
            }
            return (
                <div>
                    {order.items.map((item) => {
                        return (
                            <div key={item.id}>
                                {item.product?.name} X {item.quantity}
                            </div>
                        );
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.total)}</span>,  
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell order={row.original} />,
    },
];
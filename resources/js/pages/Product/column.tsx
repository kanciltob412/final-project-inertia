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
import { MoreHorizontal, Copy } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import products from "../../routes/products";


function ActionsCell({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);

    const handleEdit = () => {
        router.visit(products.edit(product.id));
    };

    const handleDuplicate = () => {
        router.post('/admin/products/duplicate', {
            id: product.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show a success message
            }
        });
    };

    const handleDelete = () => {
        router.delete(products.destroy(product.id));
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
                    <DropdownMenuItem onClick={handleDuplicate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                    </DropdownMenuItem>
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
                            This will delete <strong>{product.name}</strong> permanently.
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

export const columns: ColumnDef<Product>[] = [
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
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <span className="font-mono text-sm text-gray-700">
                #{row.original.id}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="normal-case">{row.original.name}</div>,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(row.original.price)}</span>,
    },
    {
        accessorKey: "discount",
        header: "Discount",
        cell: ({ row }) => {
            const discount = row.original.discount;
            const discountType = row.original.discount_type || 'fixed';
            const discountNum = Number(discount);

            // Show dash if no discount
            if (!discount || discountNum <= 0) {
                return <span className="text-gray-400">-</span>;
            }

            return (
                <span className="text-green-600 font-medium">
                    {discountType === 'percentage' ? `${Math.round(discountNum)}%` : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(discountNum)}
                </span>
            );
        },
    },
    {
        id: "final_price",
        header: "Final Price",
        cell: ({ row }) => {
            const price = row.original.price;
            const discount = row.original.discount;
            const discountType = row.original.discount_type || 'fixed';
            const discountNum = Number(discount);

            let finalPrice = price;

            // Calculate final price if there's a discount
            if (discount && discountNum > 0) {
                if (discountType === 'percentage') {
                    finalPrice = price - (price * discountNum / 100);
                } else {
                    finalPrice = price - discountNum;
                }
            }

            return (
                <span>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(finalPrice)}
                </span>
            );
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.original.stock || 0;
            return (
                <span className={`font-medium ${stock === 0 ? 'text-red-600' :
                    (stock >= 1 && stock <= 3 ? 'text-red-600' :
                        (stock <= 5 ? 'text-orange-600' : 'text-green-600'))
                    }`}>
                    {stock === 0 ? 'Out of stock' :
                        (stock >= 1 && stock <= 3 ? `Only ${stock} left` :
                            `${stock} available`)}
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
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => <img src={`../../storage/${row.original.image}`} alt={row.original.name} className="h-12 w-12 object-cover" />,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell product={row.original} />,
    },
];
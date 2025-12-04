import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Order } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import orders from '../../routes/orders';

function ActionsCell({ order }: { order: Order }) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleEdit = () => {
        router.visit(orders.edit(order.id));
    };

    const handleDelete = () => {
        router.delete(orders.destroy(order.id));
        setDeleteOpen(false);
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
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setTimeout(() => {
                                setDeleteOpen(true);
                            }, 50);
                        }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'user',
        header: 'Customer Details',
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="max-w-xs space-y-1">
                    <div className="font-medium text-gray-900">{order.full_name || order.user?.name || 'Guest'}</div>
                    <div className="text-sm text-gray-600">{order.user?.email}</div>
                    <div className="text-sm text-gray-600">{order.phone}</div>
                    <div className="text-sm text-gray-500">
                        <div>{order.address}</div>
                        <div>
                            {order.city}, {order.country} {order.postal_code}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'items',
        header: 'Products',
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <span className="text-gray-500">No items</span>;
            }
            return (
                <div className="max-w-xs space-y-1">
                    {order.items.map((item) => {
                        const itemName = item.product?.name || 'Product';

                        return (
                            <div key={item.id} className="border-b border-gray-100 pb-1 text-sm last:border-0 last:pb-0">
                                <div className="font-medium text-gray-900 normal-case">{itemName}</div>
                                <div className="text-xs text-gray-500">SKU: {item.product?.sku || 'N/A'}</div>
                                {item.product?.dimension && <div className="text-xs text-gray-500">Dimension: {item.product.dimension}</div>}
                            </div>
                        );
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <div>-</div>;
            }
            return (
                <div>
                    {order.items.map((item) => (
                        <div key={item.id} className="mb-1 text-sm">
                            {item.quantity}
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <div>-</div>;
            }
            return (
                <div>
                    {order.items.map((item) => {
                        // item.price is the discounted price per unit
                        // item.discount is the discount amount per unit
                        const originalPricePerUnit = (item.price || 0) + (item.discount || 0);
                        return (
                            <div key={item.id} className="mb-1 text-sm">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(originalPricePerUnit)}
                            </div>
                        );
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <div>-</div>;
            }
            return (
                <div>
                    {order.items.map((item) => {
                        // item.discount is the discount amount per unit
                        // Multiply by quantity to get total discount for this item
                        const totalDiscountAmount = (item.discount || 0) * (item.quantity || 1);

                        return (
                            <div key={item.id} className="mb-1 text-sm font-medium text-red-600">
                                {totalDiscountAmount > 0
                                    ? `-Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(totalDiscountAmount)}`
                                    : '-'}
                            </div>
                        );
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: 'subtotal',
        header: 'Subtotal',
        cell: ({ row }) => {
            const order = row.original;
            if (!order.items || order.items.length === 0) {
                return <div>-</div>;
            }
            return (
                <div>
                    {order.items.map((item) => {
                        // item.price is the line total (price × quantity), item.discount is already applied
                        // So subtotal is simply item.price
                        return (
                            <div key={item.id} className="mb-1 text-sm font-semibold">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(item.price)}
                            </div>
                        );
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: 'coupon_id',
        header: 'Coupon',
        cell: ({ row }) => {
            const order = row.original;

            if (order.coupon && order.coupon_id) {
                return (
                    <div className="space-y-1 text-sm">
                        <div className="rounded bg-blue-50 px-2 py-1 font-mono font-semibold text-blue-600">{order.coupon.code}</div>
                        <div className="text-xs text-gray-500">
                            {order.coupon.discount_type === 'percentage'
                                ? `${order.coupon.discount_value}% off`
                                : `Rp ${new Intl.NumberFormat('id-ID', {
                                    maximumFractionDigits: 0,
                                }).format(order.coupon.discount_value)}`}
                        </div>
                    </div>
                );
            }
            return <span className="text-sm text-gray-400">-</span>;
        },
    },
    {
        accessorKey: 'shipping_cost',
        header: 'Shipping',
        cell: ({ row }) => {
            const order = row.original;
            const shippingCost = order.shipping_cost || 0;

            if (shippingCost > 0 || order.shipping_courier) {
                return (
                    <div className="space-y-1 text-sm">
                        <div className="font-medium text-gray-900">
                            {shippingCost > 0
                                ? new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(shippingCost)
                                : 'Free'}
                        </div>
                        {order.shipping_courier && (
                            <div className="text-xs text-gray-500">
                                {order.shipping_courier.toUpperCase()} - {order.shipping_service}
                            </div>
                        )}
                        {order.tracking_number && (
                            <div className="rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">Track: {order.tracking_number}</div>
                        )}
                    </div>
                );
            }
            return <span className="text-sm text-gray-400">Free</span>;
        },
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
            <span className="text-lg font-bold">
                {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                }).format(row.original.total)}
            </span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Order Date',
        cell: ({ row }) => {
            const createdAt = new Date(row.original.created_at);
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                    <div className="text-gray-500">
                        {createdAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                PENDING: { variant: 'secondary' as const, text: 'Pending', className: 'bg-gray-100 text-gray-800' },
                PAID: { variant: 'default' as const, text: 'Paid', className: 'bg-green-100 text-green-800' },
                PROCESSING: { variant: 'default' as const, text: 'Processing', className: 'bg-blue-100 text-blue-800' },
                SHIPPED: { variant: 'outline' as const, text: 'Shipped', className: 'bg-purple-100 text-purple-800' },
                DELIVERED: { variant: 'default' as const, text: 'Delivered', className: 'bg-green-100 text-green-800' },
                CANCELLED: { variant: 'destructive' as const, text: 'Cancelled', className: 'bg-red-100 text-red-800' },
            };

            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
            return <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>{config.text}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell order={row.original} />,
    },
];

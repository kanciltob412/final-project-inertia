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

// Helper function to convert hex color to readable color name
const getColorName = (colorValue: string) => {
    // If it's already a color name (not hex), return as is
    if (!colorValue.startsWith('#')) {
        return colorValue.charAt(0).toUpperCase() + colorValue.slice(1).toLowerCase();
    }
    
    // Common hex to color name mappings
    const colorMap: Record<string, string> = {
        '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue', '#FFFF00': 'Yellow',
        '#FF00FF': 'Magenta', '#00FFFF': 'Cyan', '#FFA500': 'Orange', '#800080': 'Purple',
        '#FFC0CB': 'Pink', '#A52A2A': 'Brown', '#808080': 'Gray', '#000000': 'Black',
        '#FFFFFF': 'White', '#FFE4E1': 'Misty Rose', '#F0E68C': 'Khaki', '#E6E6FA': 'Lavender',
        '#F5DEB3': 'Wheat', '#DDA0DD': 'Plum', '#98FB98': 'Pale Green', '#F0F8FF': 'Alice Blue',
        '#FAEBD7': 'Antique White', '#D2691E': 'Chocolate', '#FF7F50': 'Coral', '#6495ED': 'Cornflower Blue',
        '#DC143C': 'Crimson', '#B22222': 'Fire Brick', '#228B22': 'Forest Green', '#FFD700': 'Gold',
        '#DAA520': 'Golden Rod', '#ADFF2F': 'Green Yellow', '#FF69B4': 'Hot Pink', '#4B0082': 'Indigo',
        '#32CD32': 'Lime Green', '#800000': 'Maroon', '#000080': 'Navy', '#808000': 'Olive',
        '#FF4500': 'Orange Red', '#DA70D6': 'Orchid', '#CD853F': 'Peru', '#B0E0E6': 'Powder Blue',
        '#663399': 'Rebecca Purple', '#FA8072': 'Salmon', '#F4A460': 'Sandy Brown', '#2E8B57': 'Sea Green',
        '#A0522D': 'Sienna', '#C0C0C0': 'Silver', '#87CEEB': 'Sky Blue', '#708090': 'Slate Gray',
        '#FFFAFA': 'Snow', '#00FF7F': 'Spring Green', '#4682B4': 'Steel Blue', '#D2B48C': 'Tan',
        '#008080': 'Teal', '#D8BFD8': 'Thistle', '#FF6347': 'Tomato', '#40E0D0': 'Turquoise',
        '#EE82EE': 'Violet', '#F5F5DC': 'Beige'
    };
    
    const upperHex = colorValue.toUpperCase();
    if (colorMap[upperHex]) return colorMap[upperHex];
    
    // Simple color detection for unlisted hex codes
    try {
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        if (r > 200 && g < 100 && b < 100) return 'Red';
        if (r < 100 && g > 200 && b < 100) return 'Green';
        if (r < 100 && g < 100 && b > 200) return 'Blue';
        if (r > 200 && g > 200 && b < 100) return 'Yellow';
        if (r > 200 && g < 100 && b > 200) return 'Magenta';
        if (r < 100 && g > 200 && b > 200) return 'Cyan';
        if (r > 150 && g > 100 && b < 100) return 'Orange';
        if (r > 100 && g < 100 && b > 100) return 'Purple';
        if (r > 200 && g > 150 && b > 150) return 'Pink';
        if (r < 100 && g < 100 && b < 100) return 'Black';
        if (r > 200 && g > 200 && b > 200) return 'White';
        if (Math.abs(r - g) < 50 && Math.abs(g - b) < 50) return 'Gray';
        
        return 'Custom Color';
    } catch {
        return colorValue;
    }
};

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
        cell: ({ row }) => (
            <span className="font-mono text-sm text-gray-700">
                #{row.original.id}
            </span>
        ),
    },
    {
        accessorKey: "sku",
        header: "SKU",
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <p className="truncate text-sm text-gray-600" title={row.original.description}>
                    {row.original.description}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.original.variants || [];
            if (variants.length === 0) {
                return <span className="text-gray-400">No variants</span>;
            }
            
            return (
                <div className="flex flex-wrap gap-1 max-w-32">
                    {variants.slice(0, 3).map((variant, index) => (
                        <div 
                            key={index}
                            className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                            style={{ backgroundColor: variant.color }}
                            title={`${getColorName(variant.color)} - Stock: ${variant.stock}`}
                        />
                    ))}
                    {variants.length > 3 && (
                        <div className="w-6 h-6 rounded border border-gray-300 shadow-sm bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                            +{variants.length - 3}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.price)}</span>,
    },
    {
        accessorKey: "variants",
        header: "Total Stock",
        cell: ({ row }) => {
            const variants = row.original.variants || [];
            const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
            
            return (
                <span className={`font-medium ${
                    totalStock <= 0 ? 'text-red-600' : 
                    totalStock <= 10 ? 'text-orange-600' : 
                    'text-green-600'
                }`}>
                    {totalStock}
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
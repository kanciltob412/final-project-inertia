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
import { Article } from "../../types";

function ActionsCell({ article }: { article: Article }) {
    const [open, setOpen] = useState(false);

    const handleEdit = () => {
        router.visit(`/admin/articles/${article.id}/edit`);
    };

    const handleDuplicate = () => {
        router.post('/admin/articles/duplicate', {
            id: article.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show a success message
            }
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/articles/${article.id}`);
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
                            This will delete <strong>{article.title}</strong> permanently.
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

export const columns: ColumnDef<Article>[] = [
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
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "excerpt",
        header: "Excerpt",
        cell: ({ row }) => (
            <div className="max-w-xs truncate">
                {row.original.excerpt}
            </div>
        ),
    },
    {
        accessorKey: "keywords",
        header: "Keywords",
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs ${row.original.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {row.original.is_featured ? 'Featured' : 'Regular'}
            </span>
        ),
    },
    {
        accessorKey: "featured_image",
        header: "Featured Image",
        cell: ({ row }) => {
            const featuredImage = row.getValue('featured_image') as string;
            return (
                <img
                    src={
                        featuredImage?.startsWith('http')
                            ? featuredImage
                            : featuredImage
                                ? `/storage/${featuredImage}`
                                : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'
                    }
                    alt={row.original.title}
                    className="h-12 w-12 object-cover rounded"
                />
            );
        },
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell article={row.original} />,
    },
];
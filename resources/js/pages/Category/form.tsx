import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Category } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Categories",
        href: "/admin/categories",
    },
];

interface Props {
    category?: Category;
}

export default function Form({ category }: Props) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: category?.name || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            patch(`/admin/categories/${category.id}`, {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        } else {
            post('/admin/categories', {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category ? "Edit Category" : "Create Category"} />

            <div className="p-6">
                <HeadingSmall
                    title={`${category ? "Edit" : "Create"} Category`}
                    description={`Fill out the form below to ${category ? "edit an existing" : "create a new"} category.`}
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            disabled={processing}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {category ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

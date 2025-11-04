import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Category, Product } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import products from "@/routes/products";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: products.index().url,
    },
];

interface Props {
    categories: Category[];
    product?: Product;
}

export default function Form({ categories, product }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: product?.category_id.toString() || "",
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price.toString() || "",
        stock: product?.stock.toString() || "",
        color: product?.color || "",
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            router.post(products.update(product.id), {
                ...data,
                _method: "put",
            }, {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        } else {
            post(products.store().url, {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product ? "Edit Product" : "Create Product"} />

            <div className="p-6">
                <HeadingSmall
                    title={`${product ? "Edit" : "Create"} Product`}
                    description={`Fill out the form below to ${product ? "edit an existing" : "create a new"} product.`}
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category */}
                    <div className="flex flex-col gap-y-4">
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(value) => setData("category_id", value)}
                            disabled={processing}
                        >
                            <SelectTrigger id="category_id">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && (
                            <p className="text-sm text-red-600">{errors.category_id}</p>
                        )}
                    </div>

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
                    {/* Description */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            disabled={processing}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            disabled={processing}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600">{errors.price}</p>
                        )}
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData("stock", e.target.value)}
                            disabled={processing}
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-600">{errors.stock}</p>
                        )}
                    </div>
                    {/* Color */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                            id="color"
                            type="color"
                            value={data.color}
                            onChange={(e) => setData("color", e.target.value)}
                            disabled={processing}
                        />
                        {errors.color && (
                            <p className="text-sm text-red-600">{errors.color}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) => setData("image", e.target.files ? e.target.files[0] : null)}
                            disabled={processing}
                        />
                        {errors.image && (
                            <p className="text-sm text-red-600">{errors.image}</p>
                        )}
                        {product?.image && (
                            <div className="mt-2">
                                <p className="text-sm leading-none font-medium mb-4">Current Image:</p>
                                <img src={`../../../../storage/${product.image}`} alt={product.name} className="size-24! object-cover rounded" />
                            </div>
                        )}

                    </div>
                    {/* Submit */}
                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {product ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
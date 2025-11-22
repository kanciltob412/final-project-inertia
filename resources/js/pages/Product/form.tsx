import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Category, Product } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from "@/components/TiptapEditor";
import MultiImageUpload from "@/components/MultiImageUpload";
import { useForm } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/admin/products",
    },
];

interface Props {
    categories: Category[];
    product?: Product;
}

export default function Form({ categories, product }: Props) {
    // Safe image mapping (no variant/color logic)
    // Only use File[] for upload, metadata for display can be handled separately if needed
    const initialGalleryFiles: File[] = [];

    const { data, setData, processing, errors } = useForm({
        sku: product?.sku || "",
        category_id: product?.category_id?.toString() || "",
        name: product?.name || "",
        description: product?.description || "",
        stock: product?.stock?.toString() || "",
        price: product?.price?.toString() || "",
        discount: product?.discount?.toString() || "",
        discount_type: product?.discount_type || "fixed",
        gallery_images: initialGalleryFiles,
    });

    // Debug logging
    console.log('Product Form Loaded', { product, categories });

    // Safety check for product data
    if (product && !product.id) {
        console.error('Invalid product data:', product);
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Error" />
                <div className="p-6">
                    <div className="text-red-600">Error: Invalid product data</div>
                </div>
            </AppLayout>
        );
    }

    // Check if categories is empty
    if (!categories || categories.length === 0) {
        console.error('No categories found');
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Error" />
                <div className="p-6">
                    <div className="text-red-600">Error: No categories available. Please create categories first.</div>
                </div>
            </AppLayout>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for file uploads
        const formData = new FormData();

        // Add regular form fields - ALWAYS add these, even if empty
        formData.append('sku', data.sku || '');
        formData.append('name', data.name || '');
        formData.append('description', data.description || '');
        formData.append('price', data.price?.toString() || '0');
        formData.append('discount', data.discount?.toString() || '0');
        formData.append('discount_type', data.discount_type || 'fixed');
        formData.append('category_id', data.category_id?.toString() || '');
        formData.append('stock', data.stock?.toString() || '0');

        // Add gallery images (File[])
        let galleryIndex = 0;
        data.gallery_images?.forEach((file) => {
            formData.append(`gallery_images[${galleryIndex}]`, file);
            galleryIndex++;
        });

        if (product) {
            formData.append('_method', 'PUT');
            // Updating product
            router.post(`/admin/products/${product.id}`, formData, {
                preserveScroll: true,
                onFinish: () => {
                    // Redirect after submission (success or error)
                    setTimeout(() => {
                        window.location.href = '/admin/products';
                    }, 500);
                }
            });
        } else {
            // Creating new product
            router.post('/admin/products', formData, {
                preserveScroll: true,
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

                    {/* SKU */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            value={data.sku}
                            onChange={(e) => setData("sku", e.target.value)}
                            disabled={processing}
                            placeholder="e.g., PRD-ABC123"
                        />
                        {errors.sku && (
                            <p className="text-sm text-red-600">{errors.sku}</p>
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
                        <TiptapEditor
                            content={data.description}
                            onChange={(content: string) => setData("description", content)}
                            disabled={processing}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Gallery Images */}
                        <div className="space-y-6">
                            {/* Gallery Images - Featured image becomes main product image */}
                            <MultiImageUpload
                                label="Product Gallery (First image will be featured as main product image)"
                                value={data.gallery_images}
                                onChange={(images) => setData("gallery_images", images)}
                                maxImages={8}
                                disabled={processing}
                                error={errors.gallery_images}
                            />
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-6">
                            {/* Dimension field removed */}

                            {/* Stock */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData("stock", e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 100"
                                    min="0"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 99.99"
                                    min="0"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            {/* Discount Type */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="discount_type">Discount Type</Label>
                                <Select
                                    value={data.discount_type}
                                    onValueChange={(value) => setData("discount_type", value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="discount_type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.discount_type && (
                                    <p className="text-sm text-red-600">{errors.discount_type}</p>
                                )}
                            </div>

                            {/* Discount */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="discount">Discount {data.discount_type === 'percentage' ? '(%)' : '(Amount)'}</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    step="0.01"
                                    value={data.discount}
                                    onChange={(e) => setData("discount", e.target.value)}
                                    disabled={processing}
                                    placeholder={data.discount_type === 'percentage' ? 'e.g., 10' : 'e.g., 9.99'}
                                    min="0"
                                />
                                {errors.discount && (
                                    <p className="text-sm text-red-600">{errors.discount}</p>
                                )}
                            </div>
                        </div>
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

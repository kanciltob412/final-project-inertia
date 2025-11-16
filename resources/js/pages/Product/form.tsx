import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Category, Product } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from "@/components/TiptapEditor";
import MultiImageUpload from "@/components/MultiImageUpload";

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

    // Safe image mapping
    const initialGalleryImages = product?.images && Array.isArray(product.images)
        ? product.images.map((img: any) => ({
            id: img.id,
            url: img.image_path ? `/storage/${img.image_path}` : '',
            alt_text: img.alt_text || '',
            is_primary: img.is_primary || false,
            sort_order: img.sort_order || 0
        }))
        : [];

    const { data, setData, post, processing, errors, reset } = useForm({
        sku: product?.sku || "",
        category_id: product?.category_id?.toString() || "",
        name: product?.name || "",
        description: product?.description || "",
        dimension: product?.dimension || "",
        stock: product?.stock?.toString() || "",
        price: product?.price?.toString() || "",
        discount: product?.discount?.toString() || "0",
        discount_type: product?.discount_type || "fixed",
        gallery_images: initialGalleryImages,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for file uploads
        const formData = new FormData();

        // Add regular form fields - ALWAYS add these, even if empty
        formData.append('name', data.name || '');
        formData.append('description', data.description || '');
        formData.append('price', data.price?.toString() || '0');
        formData.append('category_id', data.category_id?.toString() || '');
        
        // Add product-level fields
        formData.append('dimension', data.dimension || '');
        formData.append('stock', data.stock?.toString() || '0');
        formData.append('discount', data.discount?.toString() || '0');
        formData.append('discount_type', data.discount_type || 'fixed');

        // Add gallery images (only new File objects)
        let galleryIndex = 0;
        data.gallery_images?.forEach((image) => {
            if (image.file) {
                formData.append(`gallery_images[${galleryIndex}]`, image.file);
                galleryIndex++;
            }
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
                            value={data.description}
                            onChange={(value: string) => setData("description", value)}
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
                            {/* Dimension */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="dimension">Dimension</Label>
                                <Input
                                    id="dimension"
                                    value={data.dimension}
                                    onChange={(e) => setData("dimension", e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 100x200x50"
                                />
                                {errors.dimension && (
                                    <p className="text-sm text-red-600">{errors.dimension}</p>
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

                            {/* Discount */}
                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="discount"
                                        type="number"
                                        step="1"
                                        value={data.discount}
                                        onChange={(e) => setData("discount", e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g., 10000"
                                        min="0"
                                        className="flex-1"
                                    />
                                    <Select
                                        value={data.discount_type}
                                        onValueChange={(value) => setData("discount_type", value as 'fixed' | 'percentage')}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed (Rp)</SelectItem>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.discount && (
                                    <p className="text-sm text-red-600">{errors.discount}</p>
                                )}
                                {/* Show calculated price */}
                                {data.price && data.discount && (
                                    <p className="text-sm text-gray-600">
                                        {data.discount_type === 'fixed' 
                                            ? `Final price: Rp ${(parseFloat(data.price) - parseFloat(data.discount)).toLocaleString('id-ID')}`
                                            : `Final price: Rp ${(parseFloat(data.price) * (1 - parseFloat(data.discount) / 100)).toLocaleString('id-ID')}`
                                        }
                                    </p>
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

import HeadingSmall from '@/components/heading-small';
import MultiImageUpload from '@/components/MultiImageUpload';
import TiptapEditor from '@/components/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Product } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
];

interface Props {
    categories: Category[];
    product?: Product;
}

export default function Form({ categories, product }: Props) {
    // Initialize gallery files array for image uploads
    const initialGalleryFiles: File[] = [];
    // Track existing images when editing
    const [existingImages, setExistingImages] = React.useState<string[]>(
        product?.images?.map((img: { image_path: string }) => img.image_path) || []
    );

    const { data, setData, processing, errors } = useForm({
        sku: product?.sku || '',
        category_id: product?.category_id?.toString() || '',
        name: product?.name || '',
        description: product?.description || '',
        stock: product?.stock?.toString() || '',
        dimension: product?.dimension || '',
        price: product?.price?.toString() || '',
        discount: product?.discount ? Math.round(Number(product.discount)).toString() : '',
        discount_type: product?.discount_type || 'fixed',
        is_active: product?.is_active ?? true,
        is_featured_carousel: product?.is_featured_carousel ?? false,
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
        formData.append('dimension', data.dimension || '');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('is_featured_carousel', data.is_featured_carousel ? '1' : '0');

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
                },
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
            <Head title={product ? 'Edit Product' : 'Create Product'} />

            <div className="p-6">
                <HeadingSmall
                    title={`${product ? 'Edit' : 'Create'} Product`}
                    description={`Fill out the form below to ${product ? 'edit an existing' : 'create a new'} product.`}
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category */}
                    <div className="flex flex-col gap-y-4">
                        <Label htmlFor="category_id">Category</Label>
                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)} disabled={processing}>
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
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    {/* SKU */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            disabled={processing}
                            placeholder="e.g., PRD-ABC123"
                        />
                        {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                    </div>

                    {/* Dimension */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="dimension">Dimension</Label>
                        <Input
                            id="dimension"
                            type="text"
                            value={data.dimension}
                            onChange={(e) => setData('dimension', e.target.value)}
                            disabled={processing}
                            placeholder="e.g., 10cm x 10cm x 5cm"
                        />
                        {errors.dimension && <p className="text-sm text-red-600">{errors.dimension}</p>}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={processing} />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="description">Description</Label>
                        <TiptapEditor
                            content={data.description}
                            onChange={(content: string) => setData('description', content)}
                            disabled={processing}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Product Details Section */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Left Column - Gallery Images */}
                        <div className="space-y-6">
                            {/* Gallery Images - Featured image becomes main product image */}
                            <MultiImageUpload
                                label="Product Gallery (First image will be featured as main product image)"
                                value={data.gallery_images}
                                onChange={(images) => setData('gallery_images', images)}
                                maxImages={8}
                                disabled={processing}
                                error={errors.gallery_images}
                                existingImages={existingImages}
                                onRemoveExisting={(imagePath) => {
                                    // If removing existing image, we'll set an empty gallery_images to trigger update
                                    // Note: User should upload new images if they remove existing ones
                                    setExistingImages(existingImages.filter(img => img !== imagePath));
                                }}
                            />
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-6">
                            {/* Stock */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 100"
                                    min="0"
                                />
                                {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    disabled={processing}
                                    placeholder="e.g., 99.99"
                                    min="0"
                                />
                                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                            </div>

                            {/* Discount Type */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="discount_type">Discount Type</Label>
                                <Select
                                    value={data.discount_type}
                                    onValueChange={(value) => setData('discount_type', value as 'fixed' | 'percentage')}
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
                                {errors.discount_type && <p className="text-sm text-red-600">{errors.discount_type}</p>}
                            </div>

                            {/* Discount */}
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="discount">Discount {data.discount_type === 'percentage' ? '(%)' : '(Amount)'}</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    step="1"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
                                    disabled={processing}
                                    placeholder={data.discount_type === 'percentage' ? 'e.g., 10' : 'e.g., 10000'}
                                    min="0"
                                />
                                {errors.discount && <p className="text-sm text-red-600">{errors.discount}</p>}
                            </div>

                            {/* Status Checkboxes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer">
                                        Product is Active
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="is_featured_carousel"
                                        checked={data.is_featured_carousel}
                                        onCheckedChange={(checked) => setData('is_featured_carousel', checked as boolean)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="is_featured_carousel" className="cursor-pointer">
                                        Featured in Carousel (Show on inspiring products section)
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {product ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

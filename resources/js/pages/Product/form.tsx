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
import CKEditorComponent from "@/components/CKEditorComponent";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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

interface VariantFormData {
    id?: number | string;
    color: string;
    stock: string;
}

export default function Form({ categories, product }: Props) {
    // Initialize variants from existing product or default single variant
    const initialVariants: VariantFormData[] = product?.variants?.map(variant => ({
        id: variant.id,
        color: variant.color,
        stock: variant.stock.toString(),
    })) || [{ id: `default-variant-${Date.now()}`, color: "", stock: "" }];

    const [variants, setVariants] = useState<VariantFormData[]>(initialVariants);

    const { data, setData, post, processing, errors, reset } = useForm({
        sku: product?.sku || "",
        category_id: product?.category_id.toString() || "",
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price.toString() || "",
        image: null as File | null,
        gallery_images: product?.images ? product.images.map((img: any) => ({
            id: img.id,
            url: `/storage/${img.image_path}`,
            alt_text: img.alt_text || '',
            is_primary: img.is_primary,
            sort_order: img.sort_order
        })) : [] as any[],
        variants: initialVariants,
    });

    // Variant management functions
    const addVariant = () => {
        const newVariant = { 
            id: `new-variant-${Date.now()}-${Math.random()}`, 
            color: "", 
            stock: "" 
        };
        const newVariants = [...variants, newVariant];
        setVariants(newVariants);
        setData("variants", newVariants);
    };

    const removeVariant = (index: number) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
        setData("variants", newVariants);
    };

    const updateVariant = (index: number, field: keyof VariantFormData, value: string) => {
        const newVariants = variants.map((variant, i) => 
            i === index ? { ...variant, [field]: value } : variant
        );
        setVariants(newVariants);
        setData("variants", newVariants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add regular form fields
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('category_id', data.category_id.toString());
        
        // Add variants
        variants.forEach((variant, index) => {
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][stock]`, variant.stock.toString());
            if (variant.id) {
                formData.append(`variants[${index}][id]`, variant.id.toString());
            }
        });
        
        // Add legacy image if exists
        if (data.image) {
            formData.append('image', data.image);
        }
        
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
            router.post(products.update(product.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Product updated successfully
                    reset();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                },
                forceFormData: true,
            });
        } else {
            // Creating new product
            router.post(products.store().url, formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    // Product created successfully
                    reset();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                },
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
                        <CKEditorComponent
                            data={data.description}
                            onChange={(description) => setData("description", description)}
                            disabled={processing}
                            placeholder="Write a detailed product description..."
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
                    {/* Product Variants */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Color Variants</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addVariant}
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Variant
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={variant.id || `new-variant-${index}`} className="p-4 border rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Variant {index + 1}</h4>
                                        {variants.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeVariant(index)}
                                                disabled={processing}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Color Selection */}
                                        <div className="space-y-3">
                                            <Label>Color</Label>
                                            <div className="grid grid-cols-8 gap-2">
                                                {[
                                                    { name: 'Red', value: '#FF0000' },
                                                    { name: 'Green', value: '#00FF00' },
                                                    { name: 'Blue', value: '#0000FF' },
                                                    { name: 'Yellow', value: '#FFFF00' },
                                                    { name: 'Orange', value: '#FFA500' },
                                                    { name: 'Purple', value: '#800080' },
                                                    { name: 'Pink', value: '#FFC0CB' },
                                                    { name: 'Brown', value: '#A52A2A' },
                                                    { name: 'Black', value: '#000000' },
                                                    { name: 'White', value: '#FFFFFF' },
                                                    { name: 'Gray', value: '#808080' },
                                                    { name: 'Navy', value: '#000080' },
                                                    { name: 'Maroon', value: '#800000' },
                                                    { name: 'Olive', value: '#808000' },
                                                    { name: 'Teal', value: '#008080' },
                                                    { name: 'Silver', value: '#C0C0C0' },
                                                    { name: 'Lime', value: '#32CD32' },
                                                    { name: 'Aqua', value: '#00FFFF' },
                                                    { name: 'Fuchsia', value: '#FF00FF' },
                                                    { name: 'Coral', value: '#FF7F50' },
                                                    { name: 'Gold', value: '#FFD700' },
                                                    { name: 'Salmon', value: '#FA8072' },
                                                    { name: 'Khaki', value: '#F0E68C' },
                                                    { name: 'Plum', value: '#DDA0DD' },
                                                    { name: 'Turquoise', value: '#40E0D0' },
                                                    { name: 'Violet', value: '#EE82EE' },
                                                    { name: 'Wheat', value: '#F5DEB3' },
                                                    { name: 'Beige', value: '#F5F5DC' },
                                                    { name: 'Crimson', value: '#DC143C' },
                                                    { name: 'Indigo', value: '#4B0082' },
                                                    { name: 'Chocolate', value: '#D2691E' },
                                                    { name: 'Peru', value: '#CD853F' }
                                                ].map((color) => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        className={`w-8 h-8 rounded border-2 shadow-sm hover:scale-110 transition-transform ${
                                                            variant.color === color.value 
                                                                ? 'border-black border-4' 
                                                                : 'border-gray-300'
                                                        }`}
                                                        style={{ backgroundColor: color.value }}
                                                        onClick={() => updateVariant(index, "color", color.value)}
                                                        title={color.name}
                                                        disabled={processing}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {/* Selected Color Preview */}
                                            {variant.color && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                    <span className="text-sm font-medium">Selected:</span>
                                                    <div 
                                                        className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                                                        style={{ backgroundColor: variant.color }}
                                                    />
                                                    <span className="text-sm text-gray-600">{variant.color}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Stock Input */}
                                        <div className="space-y-2">
                                            <Label>Stock Quantity</Label>
                                            <Input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, "stock", e.target.value)}
                                                disabled={processing}
                                                placeholder="e.g., 50"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {errors.variants && (
                            <p className="text-sm text-red-600">{errors.variants}</p>
                        )}
                    </div>
                    {/* Gallery Images */}
                    <MultiImageUpload
                        label="Product Gallery"
                        value={data.gallery_images}
                        onChange={(images) => setData("gallery_images", images)}
                        maxImages={8}
                        disabled={processing}
                        error={errors.gallery_images}
                    />
                    
                    {/* Legacy Image Upload (for backward compatibility) */}
                    <ImageUpload
                        id="image"
                        label="Main Product Image (Legacy)"
                        value={data.image}
                        onChange={(file) => setData("image", file)}
                        disabled={processing}
                        currentImage={product?.image}
                        currentImageAlt={product?.name || "Product image"}
                        error={errors.image}
                    />
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
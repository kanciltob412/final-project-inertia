import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ChangeEvent } from 'react';

interface Carousel {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_path: string;
    button_1_text: string | null;
    button_1_url: string | null;
    button_2_text: string | null;
    button_2_url: string | null;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    carousel?: Carousel;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Carousels',
        href: '/admin/carousels',
    },
];

export default function Form({ carousel }: Props) {
    const { data, setData, processing, errors } = useForm({
        title: carousel?.title || '',
        subtitle: carousel?.subtitle || '',
        description: carousel?.description || '',
        button_1_text: carousel?.button_1_text || '',
        button_1_url: carousel?.button_1_url || '',
        button_2_text: carousel?.button_2_text || '',
        button_2_url: carousel?.button_2_url || '',
        sort_order: carousel?.sort_order?.toString() || '0',
        is_active: carousel?.is_active ?? true,
        image: null as File | null,
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('subtitle', data.subtitle);
        formData.append('description', data.description);
        formData.append('button_1_text', data.button_1_text);
        formData.append('button_1_url', data.button_1_url);
        formData.append('button_2_text', data.button_2_text);
        formData.append('button_2_url', data.button_2_url);
        formData.append('sort_order', data.sort_order);
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.image) {
            formData.append('image', data.image);
        }

        if (carousel) {
            formData.append('_method', 'PUT');
            router.post(`/admin/carousels/${carousel.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.post('/admin/carousels', formData, {
                forceFormData: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={carousel ? 'Edit Carousel Slide' : 'Create Carousel Slide'} />

            <div className="p-6">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/admin/carousels">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <HeadingSmall
                        title={carousel ? 'Edit Carousel Slide' : 'Create Carousel Slide'}
                        description={carousel ? 'Update the carousel slide details' : 'Add a new carousel slide to the hero section'}
                    />
                </div>

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Title */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            disabled={processing}
                            placeholder="e.g., Elevate Your Spaces"
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Subtitle */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                            id="subtitle"
                            value={data.subtitle}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            disabled={processing}
                            placeholder="e.g., Premium Ceramic Collections"
                        />
                        {errors.subtitle && <p className="text-sm text-red-600">{errors.subtitle}</p>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            placeholder="Enter slide description"
                            className="rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm"
                            rows={4}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="image">Image</Label>
                        {carousel?.image_path && !data.image && (
                            <div className="mb-4">
                                <img
                                    src={`/storage/${carousel.image_path}`}
                                    alt={carousel.title}
                                    className="h-40 w-full rounded object-cover"
                                />
                            </div>
                        )}
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={processing}
                        />
                        {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Button 1 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="button_1_text">Button 1 Text</Label>
                            <Input
                                id="button_1_text"
                                value={data.button_1_text}
                                onChange={(e) => setData('button_1_text', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., Shop Now"
                            />
                            {errors.button_1_text && <p className="text-sm text-red-600">{errors.button_1_text}</p>}
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="button_1_url">Button 1 URL</Label>
                            <Input
                                id="button_1_url"
                                value={data.button_1_url}
                                onChange={(e) => setData('button_1_url', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., /products"
                            />
                            {errors.button_1_url && <p className="text-sm text-red-600">{errors.button_1_url}</p>}
                        </div>
                    </div>

                    {/* Button 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="button_2_text">Button 2 Text</Label>
                            <Input
                                id="button_2_text"
                                value={data.button_2_text}
                                onChange={(e) => setData('button_2_text', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., Learn More"
                            />
                            {errors.button_2_text && <p className="text-sm text-red-600">{errors.button_2_text}</p>}
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="button_2_url">Button 2 URL</Label>
                            <Input
                                id="button_2_url"
                                value={data.button_2_url}
                                onChange={(e) => setData('button_2_url', e.target.value)}
                                disabled={processing}
                                placeholder="e.g., /about"
                            />
                            {errors.button_2_url && <p className="text-sm text-red-600">{errors.button_2_url}</p>}
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="sort_order">Display Order</Label>
                        <Input
                            id="sort_order"
                            type="number"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', e.target.value)}
                            disabled={processing}
                            placeholder="0"
                            min="0"
                        />
                        {errors.sort_order && <p className="text-sm text-red-600">{errors.sort_order}</p>}
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            disabled={processing}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Slide is Active
                        </Label>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={processing}>
                            {carousel ? 'Update Slide' : 'Create Slide'}
                        </Button>
                        <Link href="/admin/carousels">
                            <Button variant="outline" disabled={processing}>
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

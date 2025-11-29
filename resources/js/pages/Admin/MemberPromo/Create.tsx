import { Head, Form, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Member Promos',
        href: '/admin/member-promos',
    },
    {
        title: 'Create',
        href: '/admin/member-promos/create',
    },
];

interface FormData {
    title: string;
    description: string;
    type: string;
    image_url: string;
    link_url: string;
    start_date: string;
    end_date: string;
    display_order: number;
    is_active: boolean;
}

export default function Create() {
    const [data, setData] = useState<FormData>({
        title: '',
        description: '',
        type: 'news',
        image_url: '',
        link_url: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        display_order: 0,
        is_active: true,
    });

    const [errors] = useState<Record<string, string>>({});
    const [processing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        setData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : type === 'number' ? parseInt(value) : value,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Member Promo" />

            <div className="space-y-6 p-4 md:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Create New Promo</h1>
                    <p className="text-gray-600">Add a new promotion or news for members</p>
                </div>

                {/* Form */}
                <Card>
                    <CardContent className="pt-6">
                        <Form method="post" action="/admin/member-promos" className="space-y-6">
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    onChange={handleChange}
                                    placeholder="Promo or news title"
                                    required
                                />
                                {errors.title && <InputError message={errors.title} />}
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    placeholder="Detailed description of the promo or news"
                                    rows={5}
                                    required
                                />
                                {errors.description && <InputError message={errors.description} />}
                            </div>

                            {/* Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type *</Label>
                                <select
                                    id="type"
                                    name="type"
                                    value={data.type}
                                    onChange={handleChange}
                                    className="rounded-md border border-gray-300 px-3 py-2"
                                    required
                                >
                                    <option value="news">News</option>
                                    <option value="banner">Banner</option>
                                    <option value="promotion">Promotion</option>
                                </select>
                                {errors.type && <InputError message={errors.type} />}
                            </div>

                            {/* Image URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    name="image_url"
                                    type="url"
                                    value={data.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.image_url && <InputError message={errors.image_url} />}
                            </div>

                            {/* Link URL */}
                            <div className="grid gap-2">
                                <Label htmlFor="link_url">Link URL</Label>
                                <Input
                                    id="link_url"
                                    name="link_url"
                                    type="url"
                                    value={data.link_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />
                                {errors.link_url && <InputError message={errors.link_url} />}
                            </div>

                            {/* Date Range */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.start_date && <InputError message={errors.start_date} />}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={handleChange}
                                    />
                                    {errors.end_date && <InputError message={errors.end_date} />}
                                </div>
                            </div>

                            {/* Display Order */}
                            <div className="grid gap-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    name="display_order"
                                    type="number"
                                    value={data.display_order}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.display_order && <InputError message={errors.display_order} />}
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="is_active"
                                    name="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Make this promo active
                                </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Creating...' : 'Create Promo'}
                                </Button>
                                <Link href="/admin/member-promos">
                                    <Button variant="outline" className="flex-1">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

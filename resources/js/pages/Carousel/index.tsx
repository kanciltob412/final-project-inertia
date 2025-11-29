import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Carousel {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_path: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    carousels: Carousel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function CarouselIndex({ carousels }: Props) {
    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this carousel slide?')) {
            router.delete(`/admin/carousels/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Carousels" />

            <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                    <HeadingSmall
                        title="Hero Carousel Management"
                        description="Manage the hero carousel slides that appear on the homepage"
                    />
                    <Link href="/admin/carousels/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Slide
                        </Button>
                    </Link>
                </div>

                <Separator className="my-8" />

                {carousels.length > 0 ? (
                    <div className="space-y-4">
                        {carousels.map((carousel) => (
                            <div key={carousel.id} className="flex items-center justify-between rounded-lg border bg-white p-6">
                                <div className="flex items-center gap-4">
                                    {carousel.image_path && (
                                        <img
                                            src={`/storage/${carousel.image_path}`}
                                            alt={carousel.title}
                                            className="h-20 w-32 rounded object-cover"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{carousel.title}</h3>
                                        <p className="text-sm text-gray-600">{carousel.subtitle}</p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <span className="text-xs text-gray-500">Order: {carousel.sort_order}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${carousel.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {carousel.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/carousels/${carousel.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(carousel.id)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed bg-gray-50 p-12 text-center">
                        <p className="text-gray-600">No carousel slides yet. Create your first slide!</p>
                        <Link href="/admin/carousels/create" className="mt-4 inline-block">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Slide
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Promo {
    id: number;
    title: string;
    type: string;
    start_date: string;
    end_date?: string;
    is_active: boolean;
    created_at: string;
}

interface PaginatedPromos {
    data: Promo[];
    links: Array<{ label: string; url: string | null; active: boolean }>;
}

interface Props {
    promos: PaginatedPromos;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Member Promos',
        href: '/admin/member-promos',
    },
];

export default function MemberPromoIndex({ promos }: Props) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this promo?')) {
            router.delete(`/admin/member-promos/${id}`);
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item');
            return;
        }
        if (window.confirm(`Delete ${selectedItems.length} promo(s)?`)) {
            router.post('/admin/member-promos/bulk-delete', { ids: selectedItems });
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'news':
                return 'bg-blue-100 text-blue-800';
            case 'banner':
                return 'bg-purple-100 text-purple-800';
            case 'promotion':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Member Promos Management" />

            <div className="space-y-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Member Promos & News</h1>
                        <p className="text-gray-600">Manage promotions and news for members</p>
                    </div>
                    <Link href="/admin/member-promos/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Promo
                        </Button>
                    </Link>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="flex items-center justify-between pt-6">
                            <span className="text-sm font-medium">{selectedItems.length} item(s) selected</span>
                            <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                                Delete Selected
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Promos Table */}
                {promos.data.length > 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="w-8 px-4 py-2 text-left">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        setSelectedItems(e.target.checked ? promos.data.map((p) => p.id) : []);
                                                    }}
                                                    checked={selectedItems.length === promos.data.length}
                                                />
                                            </th>
                                            <th className="px-4 py-2 text-left font-semibold">Title</th>
                                            <th className="px-4 py-2 text-left font-semibold">Type</th>
                                            <th className="px-4 py-2 text-left font-semibold">Date Range</th>
                                            <th className="px-4 py-2 text-left font-semibold">Status</th>
                                            <th className="px-4 py-2 text-right font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promos.data.map((promo) => (
                                            <tr key={promo.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(promo.id)}
                                                        onChange={(e) => {
                                                            setSelectedItems(
                                                                e.target.checked
                                                                    ? [...selectedItems, promo.id]
                                                                    : selectedItems.filter((id) => id !== promo.id)
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium">{promo.title}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded px-2 py-1 text-xs font-medium ${getTypeColor(promo.type)}`}>
                                                        {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(promo.start_date).toLocaleDateString()}
                                                        {promo.end_date && ` - ${new Date(promo.end_date).toLocaleDateString()}`}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                    >
                                                        {promo.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/member-promos/${promo.id}/edit`}>
                                                            <Button variant="outline" size="sm" className="gap-1">
                                                                <Edit2 className="h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(promo.id)}
                                                            className="gap-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">No promos created yet. Create your first one!</p>
                            <Link href="/admin/member-promos/create">
                                <Button className="mt-4 gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Promo
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

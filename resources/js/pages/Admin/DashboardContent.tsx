import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useState } from 'react';

interface Content {
    id: number;
    type: 'banner' | 'news' | 'promotion' | 'info';
    title: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    content?: string;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
    display_order: number;
}

interface Props {
    content: Content[];
}

export default function DashboardContent({ content }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Slider & Announcements', href: '#' },
    ];

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, delete: deleteItem, processing, reset } = useForm({
        type: 'banner' as 'banner' | 'news' | 'promotion' | 'info',
        title: '',
        description: '',
        image_url: '',
        image: null as File | null,
        link_url: '',
        content: '',
        start_date: '',
        end_date: '',
        is_active: true,
        display_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Form submitted', { editingId, data });

        const formData = new FormData();

        // Add all form fields
        formData.append('type', data.type);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('link_url', data.link_url);
        formData.append('content', data.content);
        formData.append('start_date', data.start_date);
        formData.append('end_date', data.end_date);
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('display_order', data.display_order.toString());

        // Add image if present
        if (data.image) {
            formData.append('image', data.image);
        } else if (data.image_url) {
            formData.append('image_url', data.image_url);
        }

        // Add _method for PUT requests
        if (editingId) {
            formData.append('_method', 'PUT');
        }

        const options = {
            onSuccess: () => {
                console.log('Success!');
                reset();
                setShowForm(false);
                if (editingId) setEditingId(null);
            },
            onError: (errors: Record<string, string>) => {
                console.error('Error:', errors);
            },
        };

        if (editingId) {
            router.post(`/admin/dashboard-content/${editingId}`, formData, options);
        } else {
            router.post('/admin/dashboard-content', formData, options);
        }
    };

    const handleEdit = (item: Content) => {
        setData({
            type: item.type,
            title: item.title,
            description: item.description || '',
            image_url: item.image_url || '',
            link_url: item.link_url || '',
            content: item.content || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_active: item.is_active,
            display_order: item.display_order,
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this content?')) {
            deleteItem(`/admin/dashboard-content/${id}`);
        }
    };

    const typeIcons: Record<string, string> = {
        banner: '🖼️',
        news: '📰',
        promotion: '🎁',
        info: 'ℹ️',
    };

    const typeColors: Record<string, string> = {
        banner: 'bg-blue-100 text-blue-800',
        news: 'bg-green-100 text-green-800',
        promotion: 'bg-purple-100 text-purple-800',
        info: 'bg-orange-100 text-orange-800',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-4 md:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Slider & Announcements</h1>
                        <p className="text-sm text-gray-600">Create banners, news, promotions, or announcements</p>
                    </div>
                    <Button onClick={() => {
                        reset();
                        setEditingId(null);
                        setShowForm(!showForm);
                    }} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Content
                    </Button>
                </div>

                {/* Compact Form */}
                {showForm && (
                    <Card className="border-gray-200 bg-gray-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{editingId ? 'Edit Content' : 'Create New Content'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Type</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as 'banner' | 'news' | 'promotion' | 'info')}
                                            className="w-full px-2 py-1.5 border rounded text-sm"
                                        >
                                            <option value="banner">🖼️ Banner</option>
                                            <option value="news">📰 News</option>
                                            <option value="promotion">🎁 Promotion</option>
                                            <option value="info">ℹ️ Announcement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Order (1-99)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={data.display_order}
                                            onChange={(e) => setData('display_order', parseInt(e.target.value))}
                                            className="w-full px-2 py-1.5 border rounded text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Title *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-2 py-1.5 border rounded text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Description / Subtitle</label>
                                    <textarea
                                        placeholder="Short description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={2}
                                        className="w-full px-2 py-1.5 border rounded text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Image URL</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('image', file);
                                                }
                                            }}
                                            className="w-full px-2 py-1.5 border rounded text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                        {data.image_url && (
                                            <p className="text-xs text-gray-500 mt-1">Current: {data.image_url}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Link URL (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="/products"
                                            value={data.link_url}
                                            onChange={(e) => setData('link_url', e.target.value)}
                                            className="w-full px-2 py-1.5 border rounded text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Full Content (optional)</label>
                                    <textarea
                                        placeholder="Detailed content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={2}
                                        className="w-full px-2 py-1.5 border rounded text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-2 py-1.5 border rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-2 py-1.5 border rounded text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 text-xs font-semibold">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="rounded"
                                            />
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={processing}
                                        className="cursor-pointer"
                                    >
                                        {editingId ? 'Update' : 'Create'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingId(null);
                                            reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Content List */}
                <div className="space-y-3">
                    {content.length > 0 ? (
                        content.map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[item.type]}`}>
                                                    {typeIcons[item.type]} {item.type}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${item.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.is_active ? '✓ Active' : '○ Inactive'}
                                                </span>
                                                <span className="text-xs text-gray-500">Order: {item.display_order}</span>
                                            </div>
                                            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                                            )}
                                            {(item.start_date || item.end_date) && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.start_date && new Date(item.start_date).toLocaleDateString()}
                                                    {item.start_date && item.end_date && ' → '}
                                                    {item.end_date && new Date(item.end_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(item)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(item.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-500 text-sm">No content yet. Create your first slider or announcement!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import HeadingSmall from '@/components/heading-small';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Newsletter Subscriptions',
        href: '/admin/newsletter',
    },
];

interface NewsletterSubscription {
    id: number;
    email: string;
    is_active: boolean;
    created_at: string;
    email_verified_at?: string;
}

interface Props {
    subscriptions: {
        data: NewsletterSubscription[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Newsletter({ subscriptions }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedEmails, setSelectedEmails] = useState<number[]>([]);

    const handleDelete = (id: number) => {
        router.delete(`/admin/newsletter/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
            },
        });
    };

    const handleBulkDelete = () => {
        if (selectedEmails.length === 0) return;

        router.post('/admin/newsletter/bulk', {
            ids: selectedEmails
        }, {
            onSuccess: () => {
                setSelectedEmails([]);
            },
        });
    };



    const handleExport = () => {
        window.location.href = '/admin/newsletter/export';
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Newsletter Subscriptions" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Newsletter Subscriptions"
                        description={`Manage newsletter subscriptions (${subscriptions.total} total)`}
                    />
                    <div className="flex gap-2">
                        {selectedEmails.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedEmails.length})
                            </Button>
                        )}
                        <Button
                            onClick={handleExport}
                            variant="outline"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {subscriptions.data.length > 0 ? (
                    <div className="bg-white rounded-lg shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmails.length === subscriptions.data.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedEmails(subscriptions.data.map(sub => sub.id));
                                                    } else {
                                                        setSelectedEmails([]);
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subscribed At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {subscriptions.data.map((subscription) => (
                                        <tr key={subscription.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.includes(subscription.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedEmails([...selectedEmails, subscription.id]);
                                                        } else {
                                                            setSelectedEmails(selectedEmails.filter(id => id !== subscription.id));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {subscription.email}
                                                    {subscription.email_verified_at && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(subscription.created_at).toLocaleDateString()} {new Date(subscription.created_at).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteId(subscription.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {subscriptions.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Page {subscriptions.current_page} of {subscriptions.last_page}
                                    ({subscriptions.total} total entries)
                                </div>
                                <div className="flex gap-2">
                                    {subscriptions.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/newsletter?page=${subscriptions.current_page - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {subscriptions.current_page < subscriptions.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/newsletter?page=${subscriptions.current_page + 1}`)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">No newsletter subscriptions found</div>
                        <div className="text-gray-400 text-sm">
                            Newsletter subscriptions will appear here when users subscribe to your newsletter.
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this newsletter subscription. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
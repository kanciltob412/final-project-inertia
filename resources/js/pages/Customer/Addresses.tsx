import { Link, router } from '@inertiajs/react';
import CustomerLayout from '@/layouts/customer-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, MapPin, Check } from 'lucide-react';
import { useState } from 'react';
import AddressForm from '@/components/customer/AddressForm';

interface Address {
    id: number;
    address_type: string;
    recipient_name: string;
    phone: string;
    street_address: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    notes?: string;
    is_default: boolean;
}

interface Props {
    addresses: Address[];
}

export default function Addresses({ addresses }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            router.delete(`/customer/addresses/${id}`);
        }
    };

    const handleSetDefault = (id: number) => {
        router.post(`/customer/addresses/${id}/set-default`);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingAddress(null);
    };

    return (
        <CustomerLayout title="My Addresses">

            <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
                {/* Back Link */}
                <Link href="/customer/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-6">
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">My Addresses</h1>
                        <p className="text-gray-600">Manage your shipping and billing addresses</p>
                    </div>
                    {!isFormOpen && (
                        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add New Address
                        </Button>
                    )}
                </div>

                {/* Add/Edit Address Form */}
                {isFormOpen && (
                    <div className="rounded-lg border border-gray-200 p-6">
                        <AddressForm
                            address={editingAddress}
                            onSuccess={handleFormClose}
                            onCancel={handleFormClose}
                        />
                    </div>
                )}

                {/* Addresses List */}
                {addresses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {addresses.map((address) => (
                            <Card key={address.id} className={address.is_default ? 'border-gray-500 border-2' : ''}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)} Address</CardTitle>
                                            {address.is_default && (
                                                <Badge variant="default" className="flex items-center gap-1">
                                                    <Check className="h-3 w-3" />
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Address Details */}
                                    <div className="space-y-2 text-sm">
                                        <p className="font-semibold">{address.recipient_name}</p>
                                        <p>{address.street_address}</p>
                                        <p>
                                            {address.city}
                                            {address.state && `, ${address.state}`}
                                        </p>
                                        <p>{address.postal_code}, {address.country}</p>
                                        <p className="font-medium text-gray-600">📞 {address.phone}</p>
                                        {address.notes && (
                                            <div className="mt-3 rounded-md bg-gray-50 p-2">
                                                <p className="text-xs text-gray-600">{address.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                                setEditingAddress(address);
                                                setIsFormOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>

                                    {/* Set Default Button */}
                                    {!address.is_default && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            Set as Default
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="mb-4 text-gray-500">No addresses yet. Add one to get started!</p>
                            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Your First Address
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Information Box */}
                <Card className="border-gray-200 bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-base">💡 Pro Tip</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        Save multiple addresses for quick checkout. You can set one as your default and easily switch between them during purchase.
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    );
}

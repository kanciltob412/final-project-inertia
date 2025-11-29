import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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

interface AddressFormProps {
    address?: Address | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
    const [data, setData] = useState({
        address_type: address?.address_type || 'home',
        recipient_name: address?.recipient_name || '',
        phone: address?.phone || '',
        street_address: address?.street_address || '',
        city: address?.city || '',
        state: address?.state || '',
        postal_code: address?.postal_code || '',
        country: address?.country || 'Indonesia',
        notes: address?.notes || '',
        is_default: address?.is_default || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        setData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (address) {
            router.put(`/customer/addresses/${address.id}`, data, {
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            router.post('/customer/addresses', data, {
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onSuccess: () => {
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold">{address ? 'Edit Address' : 'Add New Address'}</h3>

            {/* Address Type */}
            <div className="grid gap-2">
                <Label htmlFor="address_type">Address Type *</Label>
                <select
                    id="address_type"
                    name="address_type"
                    value={data.address_type}
                    onChange={handleChange}
                    className="rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                </select>
                {errors.address_type && <InputError message={errors.address_type} />}
            </div>

            {/* Recipient Name */}
            <div className="grid gap-2">
                <Label htmlFor="recipient_name">Recipient Name *</Label>
                <Input
                    id="recipient_name"
                    name="recipient_name"
                    value={data.recipient_name}
                    onChange={handleChange}
                    placeholder="Full name of recipient"
                    required
                />
                {errors.recipient_name && <InputError message={errors.recipient_name} />}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" value={data.phone} onChange={handleChange} placeholder="+62 812 3456 7890" required />
                {errors.phone && <InputError message={errors.phone} />}
            </div>

            {/* Street Address */}
            <div className="grid gap-2">
                <Label htmlFor="street_address">Street Address *</Label>
                <Textarea
                    id="street_address"
                    name="street_address"
                    value={data.street_address}
                    onChange={handleChange}
                    placeholder="Street address, building, floor, etc."
                    required
                />
                {errors.street_address && <InputError message={errors.street_address} />}
            </div>

            {/* City */}
            <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={data.city} onChange={handleChange} placeholder="City name" required />
                {errors.city && <InputError message={errors.city} />}
            </div>

            {/* State */}
            <div className="grid gap-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" value={data.state} onChange={handleChange} placeholder="State or province (optional)" />
                {errors.state && <InputError message={errors.state} />}
            </div>

            {/* Postal Code */}
            <div className="grid gap-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input id="postal_code" name="postal_code" value={data.postal_code} onChange={handleChange} placeholder="Postal code" required />
                {errors.postal_code && <InputError message={errors.postal_code} />}
            </div>

            {/* Country */}
            <div className="grid gap-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={data.country} onChange={handleChange} placeholder="Country" required />
                {errors.country && <InputError message={errors.country} />}
            </div>

            {/* Notes */}
            <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" name="notes" value={data.notes} onChange={handleChange} placeholder="Any special instructions (optional)" />
                {errors.notes && <InputError message={errors.notes} />}
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center gap-2">
                <input
                    id="is_default"
                    name="is_default"
                    type="checkbox"
                    checked={data.is_default}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_default" className="cursor-pointer">
                    Set as default address
                </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    );
}

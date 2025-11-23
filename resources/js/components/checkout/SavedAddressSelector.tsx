import { MapPin, Plus } from 'lucide-react';
import { SavedAddress } from '@/hooks/useSavedAddresses';
import { Link } from '@inertiajs/react';

interface SavedAddressSelectorProps {
    addresses: SavedAddress[];
    onAddressSelect: (address: SavedAddress) => void;
    currentAddressId?: number | null;
}

export default function SavedAddressSelector({
    addresses,
    onAddressSelect,
    currentAddressId,
}: SavedAddressSelectorProps) {
    if (!addresses || addresses.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg border border-black-200 bg-white-50 p-4">
            <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Your Saved Addresses</h3>
            </div>

            <div className="space-y-2">
                {addresses.map((address) => (
                    <label
                        key={address.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-100"
                    >
                        <input
                            type="radio"
                            name="saved_address"
                            value={address.id}
                            checked={currentAddressId === address.id}
                            onChange={() => onAddressSelect(address)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">
                                {address.recipient_name}
                                {address.is_default && (
                                    <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                        Default
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                <div>{address.street_address}</div>
                                <div>
                                    {address.city}
                                    {address.state && `, ${address.state}`} {address.postal_code}
                                </div>
                                <div className="text-xs text-gray-500">{address.phone}</div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            <Link href="/customer/addresses">
                <button className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                    <Plus className="h-4 w-4" />
                    Add New Address
                </button>
            </Link>
        </div>
    );
}

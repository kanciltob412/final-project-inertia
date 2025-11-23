import { useEffect, useState } from 'react';

export interface SavedAddress {
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

export const useSavedAddresses = () => {
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/customer/addresses');
                if (!response.ok) {
                    // Not logged in or no addresses
                    setAddresses([]);
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setAddresses(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch addresses');
                setAddresses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    return { addresses, loading, error };
};

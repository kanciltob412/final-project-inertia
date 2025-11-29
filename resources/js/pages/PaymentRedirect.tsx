import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    payment_url: string;
}

export default function PaymentRedirect() {
    const { payment_url } = usePage().props as unknown as Props;

    useEffect(() => {
        if (payment_url) {
            console.log('Redirecting to payment gateway:', payment_url);

            // Important: When redirecting to external payment gateway, the browser will
            // attempt to preserve session cookies based on SameSite policy.
            // Using window.location.href is the correct approach for external redirects
            // as it preserves the cookie headers in the outgoing request.
            // The session should be maintained when the user returns from the payment gateway.
            window.location.href = payment_url;
        }
    }, [payment_url]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="mb-4">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Processing Payment</h1>
                <p className="text-gray-600">Redirecting to payment gateway...</p>
                <p className="mt-4 text-sm text-gray-500">Please do not close this window.</p>
                <p className="mt-6 text-xs text-gray-400">Your session will be preserved when you return.</p>
            </div>
        </div>
    );
}

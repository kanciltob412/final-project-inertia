import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function NewsletterSubscription() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Successfully subscribed to newsletter!');
                setEmail('');
            } else {
                if (data.errors && data.errors.email) {
                    setMessage(Array.isArray(data.errors.email) ? data.errors.email[0] : data.errors.email);
                } else {
                    setMessage(data.message || 'An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Stay Updated with Lavanya Ceramics</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                Subscribe to our newsletter for the latest updates on new collections, exclusive offers, and ceramic craftsmanship insights.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-white/50 focus:ring-white/20"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="bg-white px-8 py-2 font-semibold text-black transition-all duration-300 hover:bg-gray-100 disabled:opacity-50"
                >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </form>

            {message && (
                <p className={`mt-6 text-sm font-medium ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
            )}
        </div>
    );
}

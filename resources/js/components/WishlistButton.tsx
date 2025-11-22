import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface WishlistButtonProps {
    productId: number;
    className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
    const user = usePage<SharedData>().props.auth.user;
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if product is in wishlist on mount
    useEffect(() => {
        if (!user) return;

        const checkWishlist = async () => {
            try {
                const response = await fetch(`/api/wishlist/check/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsInWishlist(data.inWishlist);
                }
            } catch (error) {
                console.error('Failed to check wishlist:', error);
            }
        };

        checkWishlist();
    }, [productId, user]);

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                const response = await fetch(`/api/wishlist/${productId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setIsInWishlist(false);
                }
            } else {
                const response = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ product_id: productId }),
                });
                if (response.ok) {
                    setIsInWishlist(true);
                }
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={loading}
            className={`transition-all duration-200 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} disabled:opacity-50 ${className}`}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                className="h-6 w-6"
                fill={isInWishlist ? 'currentColor' : 'none'}
            />
        </button>
    );
}

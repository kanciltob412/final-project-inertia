import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { SharedData } from '@/types';
import axios from 'axios';

interface WishlistButtonProps {
    productId: number;
    className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
    const page = usePage<SharedData>();
    const user = page.props.auth.user;
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if product is in wishlist on mount
    useEffect(() => {
        if (!user) return;

        const checkWishlist = async () => {
            try {
                const response = await axios.get(`/api/wishlist/check/${productId}`);
                setIsInWishlist(response.data.inWishlist);
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
            // Redirect to login if not authenticated
            router.visit('/login');
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                const response = await axios.delete(`/api/wishlist/${productId}`);
                if (response.status === 200) {
                    setIsInWishlist(false);
                }
            } else {
                try {
                    const response = await axios.post('/api/wishlist', { product_id: productId });
                    if (response.status === 200) {
                        setIsInWishlist(true);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 409) {
                        // Already in wishlist
                        setIsInWishlist(true);
                    } else {
                        console.error('Failed to add to wishlist:', error);
                    }
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

/**
 * Frontend Coupon Utilities
 * These helpers are used in checkout and cart pages for coupon handling
 */

export interface Coupon {
    id: number;
    code: string;
    discount_type: 'fixed' | 'percentage';
    discount_value: number;
    usage_limit: number | null;
    used_count: number;
    expiry_date: string | null;
    is_active: boolean;
}

/**
 * Validate coupon code by calling the API
 * @param code - Coupon code to validate
 * @returns Promise with validation result
 */
export async function validateCoupon(code: string): Promise<{
    valid: boolean;
    coupon?: Coupon;
    message?: string;
}> {
    try {
        const response = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                valid: false,
                message: errorData.message || 'Invalid coupon',
            };
        }

        const data = await response.json();
        return {
            valid: true,
            coupon: data.coupon,
        };
    } catch (error) {
        return {
            valid: false,
            message: 'Error validating coupon',
        };
    }
}

/**
 * Calculate discount amount for a given price and coupon
 * @param price - Original price
 * @param coupon - Coupon object
 * @returns Discount amount in Rp
 */
export function calculateCouponDiscount(price: number, coupon: Coupon): number {
    if (coupon.discount_type === 'fixed') {
        return Math.min(coupon.discount_value, price);
    } else {
        // percentage
        return (price * coupon.discount_value) / 100;
    }
}

/**
 * Calculate final price after coupon is applied
 * @param price - Original price
 * @param coupon - Coupon object
 * @returns Final price after discount
 */
export function calculateFinalPrice(price: number, coupon: Coupon): number {
    const discount = calculateCouponDiscount(price, coupon);
    return Math.max(0, price - discount);
}

/**
 * Format coupon discount for display
 * @param coupon - Coupon object
 * @returns Formatted string e.g., "Rp 50.000" or "20%"
 */
export function formatCouponDiscount(coupon: Coupon): string {
    if (coupon.discount_type === 'fixed') {
        return `Rp ${coupon.discount_value.toLocaleString('id-ID')}`;
    } else {
        return `${coupon.discount_value}%`;
    }
}

/**
 * Format coupon status for display
 * @param coupon - Coupon object
 * @returns Status string and color class
 */
export function getCouponStatus(coupon: Coupon): {
    status: string;
    color: string;
} {
    if (!coupon.is_active) {
        return { status: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    if (
        coupon.usage_limit !== null &&
        coupon.used_count >= coupon.usage_limit
    ) {
        return { status: 'Limit Reached', color: 'bg-yellow-100 text-yellow-800' };
    }

    return { status: 'Active', color: 'bg-green-100 text-green-800' };
}

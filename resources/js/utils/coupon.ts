import { Coupon } from '@/types';

/**
 * Calculate the discount amount based on coupon type
 * @param discountValue - The discount value
 * @param discountType - Type of discount ('fixed' or 'percentage')
 * @param amount - The amount to apply discount to
 * @returns The discount amount in rupiah
 */
export function calculateCouponDiscount(
    discountValue: number,
    discountType: 'fixed' | 'percentage',
    amount: number
): number {
    if (discountType === 'percentage') {
        return (amount * discountValue) / 100;
    }
    return discountValue;
}

/**
 * Format coupon display text
 * @param coupon - The coupon object
 * @returns Formatted coupon description
 */
export function formatCouponDisplay(coupon: Coupon): string {
    if (coupon.discount_type === 'percentage') {
        return `${coupon.discount_value}% off`;
    }
    return `Rp ${coupon.discount_value.toLocaleString('id-ID')}`;
}

/**
 * Check if a coupon is valid and can be used
 * @param coupon - The coupon object
 * @returns True if coupon is valid
 */
export function isCouponValid(coupon: Coupon | null | undefined): boolean {
    if (!coupon) return false;
    if (!coupon.is_active) return false;

    // Check expiry date
    if (coupon.expiry_date) {
        const expiryDate = new Date(coupon.expiry_date);
        if (new Date() > expiryDate) return false;
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return false;
    }

    return true;
}

/**
 * Get coupon status badge text
 * @param coupon - The coupon object
 * @returns Status text
 */
export function getCouponStatus(coupon: Coupon): string {
    if (!coupon.is_active) return 'Inactive';

    if (coupon.expiry_date) {
        const expiryDate = new Date(coupon.expiry_date);
        if (new Date() > expiryDate) return 'Expired';
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return 'Limit Reached';
    }

    return 'Active';
}

/**
 * Calculate remaining coupon uses
 * @param coupon - The coupon object
 * @returns Remaining uses or null if unlimited
 */
export function getRemainingUses(coupon: Coupon): number | null {
    if (!coupon.usage_limit) return null;
    return Math.max(0, coupon.usage_limit - coupon.used_count);
}

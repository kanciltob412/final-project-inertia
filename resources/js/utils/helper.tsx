export const formatPrice = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(number);
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatCurrencyPlain = (amount: number): string => {
    return `Rp ${new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(amount)}`;
};

export const calculateDiscountedPrice = (price: number, discount: number, discountType: 'fixed' | 'percentage'): number => {
    if (discountType === 'fixed') {
        return Math.max(0, price - discount);
    } else {
        // percentage
        return Math.max(0, price * (1 - discount / 100));
    }
};
};

# Complete Coupon System

This document provides an overview of the complete coupon system implemented in the project.

## Features

- Create, edit, and delete coupons
- Apply coupons during checkout
- Coupon validation (expiry, usage limits, etc.)
- Admin management interface
- User-facing coupon entry

## Usage

1. **Admin Panel:**
    - Navigate to the Coupons section to manage coupons.
    - Set coupon code, discount type, value, expiry date, and usage limits.
2. **Checkout:**
    - Users can enter a coupon code during checkout.
    - The system validates the coupon and applies the discount if valid.

## Validation Rules

- Coupon must be active
- Not expired
- Usage limit not exceeded
- Applicable to current cart/order

## API Endpoints

- `POST /admin/coupons` - Create coupon
- `PUT /admin/coupons/{id}` - Update coupon
- `DELETE /admin/coupons/{id}` - Delete coupon
- `POST /checkout/apply-coupon` - Apply coupon to order

## Error Handling

- Invalid coupon code
- Expired coupon
- Usage limit reached
- Coupon not applicable

## Notes

- Coupons can be percentage or fixed amount
- Admin can view usage statistics
- Coupons can be restricted to specific products or categories

---

For technical details, see `COUPON_SYSTEM_DOCUMENTATION.md`.

# Coupon System Documentation

This document describes the technical implementation of the coupon system.

## Database Structure

- **coupons** table:
    - `id`: Primary key
    - `code`: Unique coupon code
    - `type`: Discount type (fixed, percentage)
    - `value`: Discount value
    - `expires_at`: Expiry date
    - `usage_limit`: Maximum uses
    - `used_count`: Number of times used
    - `is_active`: Boolean
    - `created_at`, `updated_at`

## Backend Logic

- Coupon validation on checkout
- Usage tracking
- Expiry and activation checks
- Restriction to products/categories

## Admin Features

- CRUD operations for coupons
- Usage statistics
- Restrict coupons to products/categories

## Frontend Integration

- Coupon entry field in checkout
- Display discount and error messages
- Admin coupon management UI

## API Endpoints

- `POST /admin/coupons` - Create coupon
- `PUT /admin/coupons/{id}` - Update coupon
- `DELETE /admin/coupons/{id}` - Delete coupon
- `POST /checkout/apply-coupon` - Apply coupon

## Validation Flow

1. User enters coupon code
2. System checks:
    - Coupon exists and is active
    - Not expired
    - Usage limit not exceeded
    - Applicable to cart/order
3. If valid, discount is applied
4. If invalid, error message shown

## Error Codes

- `COUPON_INVALID`
- `COUPON_EXPIRED`
- `COUPON_USAGE_LIMIT`
- `COUPON_NOT_APPLICABLE`

---

For a feature overview, see `COMPLETE_COUPON_SYSTEM.md`.

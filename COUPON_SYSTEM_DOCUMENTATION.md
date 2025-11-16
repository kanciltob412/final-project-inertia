## Coupon System Implementation

### Database Tables
- **coupons table**: Stores all discount coupons
  - `id` - Primary key
  - `code` (string, unique) - Coupon code user enters
  - `discount_type` (enum: fixed|percentage) - Type of discount
  - `discount_value` (decimal 8,2) - Discount amount or percentage
  - `usage_limit` (integer, nullable) - Max uses, NULL for unlimited
  - `used_count` (integer) - Tracks how many times used
  - `expiry_date` (datetime, nullable) - When coupon expires
  - `is_active` (boolean) - Enable/disable coupon
  - `created_at`, `updated_at` - Timestamps

- **order table updates**:
  - Added `coupon_id` (foreign key to coupons) - Which coupon was applied
  - Added `coupon_discount` (decimal 10,2) - Discount amount calculated

### Models
**Coupon Model** (`app/Models/Coupon.php`):
- Methods:
  - `isValid()` - Check if coupon can be used (active, not expired, usage limit not reached)
  - `getValidationError()` - Return reason if invalid
  - `calculateDiscount(price)` - Calculate discount amount for a price
  - `incrementUsage()` - Increment used_count after order placed

**Order Model** (`app/Models/Order.php`):
- Added `coupon_id` and `coupon_discount` to fillable
- Added `coupon()` relationship to get the coupon applied to order

### Controller
**CouponController** (`app/Http/Controllers/CouponController.php`):
- `index()` - List all coupons with pagination
- `create()` - Show create form
- `store(Request $request)` - Save new coupon
- `edit(Coupon $coupon)` - Show edit form
- `update(Request $request, Coupon $coupon)` - Update coupon
- `destroy(Coupon $coupon)` - Delete coupon
- `validate(Request $request)` - API endpoint to validate coupon for checkout

### Routes
**Admin Routes** (`routes/admin.php`):
- Added resource routes for coupons:
  - `GET /admin/coupons` - List coupons
  - `GET /admin/coupons/create` - Create form
  - `POST /admin/coupons` - Store coupon
  - `GET /admin/coupons/{id}/edit` - Edit form
  - `PUT /admin/coupons/{id}` - Update coupon
  - `DELETE /admin/coupons/{id}` - Delete coupon

**API Routes** (`routes/api.php`):
- `POST /api/coupons/validate` - Validate coupon code for checkout

### React Components
**Coupon Admin Pages** (`resources/js/pages/Coupon/`):
- `Index.tsx` - List all coupons with status indicators
  - Shows coupon code, discount (Rp or %), usage count, expiry date
  - Status badges: Active (green), Inactive (gray), Expired (red), Limit Reached (yellow)
  - Edit and delete actions
- `Create.tsx` - Form to create new coupon
  - Code input with uppercase enforcement
  - Discount type selector (Fixed Rp or Percentage %)
  - Discount value input with live preview
  - Optional usage limit and expiry date
  - Active toggle
- `Edit.tsx` - Form to edit existing coupon
  - Same fields as Create with prepopulated values
  - Shows current usage count

### Features
1. **Two Discount Types**:
   - Fixed: Specify amount in Rp (e.g., 50000)
   - Percentage: Specify percentage (e.g., 20%)

2. **Usage Tracking**:
   - Set usage limit (optional, NULL = unlimited)
   - System tracks used_count automatically
   - Cannot use coupon after reaching limit

3. **Expiry Dates**:
   - Optional expiry date
   - Coupon becomes invalid after expiry
   - NULL expiry_date means never expires

4. **Status Control**:
   - is_active toggle to enable/disable without deleting
   - Inactive coupons cannot be used even if otherwise valid

5. **Coupon Validation** (API):
   - POST /api/coupons/validate
   - Returns: {valid: bool, coupon: object, message: string}
   - Checks: existence, active status, expiry, usage limit

### Usage Flow
1. Admin creates coupon in `/admin/coupons`
2. Admin sets code, discount amount/percentage, usage limit, expiry
3. Customer enters coupon code at checkout
4. Frontend calls POST /api/coupons/validate
5. If valid, discount is applied to order total
6. When order is placed, coupon.used_count is incremented
7. Admin can edit coupon to change discount or disable it

### Integration Notes
- Checkout integration not yet completed (pending order processing)
- Order model ready to store coupon_id and coupon_discount
- Coupon validation endpoint ready for frontend checkout integration
- All currency displayed in IDR format (Rp)

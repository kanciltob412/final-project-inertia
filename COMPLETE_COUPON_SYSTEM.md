## 🎉 Complete Coupon & Discount System Implementation

### Implementation Summary

The coupon system has been fully integrated with the checkout and payment flow. Here's how it works:

---

## 📊 System Architecture

### **Discount Flow (Two-Tier)**

```
┌─────────────────────────────────────────────────────────────┐
│                    CHECKOUT PROCESS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PRODUCT LEVEL DISCOUNTS (Built into product prices)    │
│     ┌──────────────────────────────────────┐                │
│     │ Each product has optional discount:   │                │
│     │ - discount (fixed amount or %)        │                │
│     │ - discount_type (fixed|percentage)    │                │
│     │                                       │                │
│     │ Subtotal = Sum of (product_price * qty - product_discount) │
│     └──────────────────────────────────────┘                │
│                                                              │
│  2. ORDER LEVEL COUPONS (Applied at checkout)              │
│     ┌──────────────────────────────────────┐                │
│     │ Customer enters coupon code           │                │
│     │ - Fixed discount (Rp amount)          │                │
│     │ - Percentage discount (%)             │                │
│     │ - Valid if: active, not expired,      │                │
│     │   usage limit not reached             │                │
│     │                                       │                │
│     │ Coupon Discount = calculated on       │                │
│     │ order subtotal (after product discounts) │             │
│     └──────────────────────────────────────┘                │
│                                                              │
│  FINAL TOTAL = Subtotal - Coupon Discount                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technical Implementation

### **Database Tables**

#### `products` (updated)
- `discount` (decimal 8,2) - Product-level discount amount
- `discount_type` (enum: fixed|percentage) - Type of product discount

#### `coupons` (new)
```sql
id (PK)
code (string, unique) - Coupon code customer enters
discount_type (enum: fixed|percentage) - Type of coupon discount
discount_value (decimal 10,2) - Discount amount or percentage
usage_limit (integer, nullable) - Max uses (NULL = unlimited)
used_count (integer, default 0) - Current usage count
expiry_date (datetime, nullable) - When coupon expires (NULL = never)
is_active (boolean, default true) - Enable/disable without deleting
created_at, updated_at (timestamps)
```

#### `order` (updated)
- `coupon_id` (foreign key) - Reference to applied coupon
- `coupon_discount` (decimal 10,2) - Calculated discount amount

---

## 📝 Backend Flow

### **Order Creation (payOrder method)**

```php
1. Validate request (including coupon_id)
2. Create user (auth or guest)
3. IF coupon_id provided:
   - Fetch coupon
   - Call coupon->isValid()
   - Throw exception if invalid
4. Create order with coupon_id
5. Process each product:
   - Deduct stock
   - Create order item
6. Calculate totals:
   - Sum product prices = subtotal
   - IF coupon exists:
     - coupon_discount = coupon->calculateDiscount(subtotal)
     - finalTotal = subtotal - coupon_discount
   - ELSE:
     - finalTotal = subtotal
7. Create Xendit invoice with finalTotal
```

### **Payment Success (paymentSuccess method)**

```php
1. Update order status to PAID
2. IF order has coupon:
   - coupon->incrementUsage()  // Increments used_count
   - Log coupon usage
3. Send confirmation email
4. Send admin notification
```

---

## 🎨 Frontend Flow

### **Checkout Page (Checkout.tsx)**

**State Management:**
```typescript
couponCode (string) - Input field value
validatedCoupon (Coupon | null) - Applied coupon object
couponError (string) - Error message
couponLoading (boolean) - API call loading state
```

**Calculations:**
```typescript
subtotal = sum of all item totals
productDiscountTotal = sum of all product-level discounts
couponDiscount = validatedCoupon.calculateDiscount(subtotal - productDiscountTotal)
finalTotal = subtotal - productDiscountTotal - couponDiscount
```

**Flow:**
1. Customer enters coupon code
2. Click "Apply" or press Enter
3. Call POST /api/coupons/validate
4. If valid:
   - Set validatedCoupon state
   - Set coupon_id in form data
   - Show success message with discount info
5. If invalid:
   - Show error message
   - Clear coupon state
6. Customer clicks "Place Order"
   - Submit with coupon_id and finalTotal
7. Payment page shows final invoice with coupon discount applied

---

## 📱 UI Components

### **Checkout Order Summary**
- Shows subtotal
- Shows product discounts (green, negative)
- Shows coupon input section (if no coupon applied)
  - Input field + Apply button
  - Error messages
- Shows applied coupon card (green background, CheckCircle icon)
  - Coupon code
  - Discount info
  - Remove button
- Shows coupon discount (green, negative)
- Shows final total in bold/larger font

### **Order Details Page**
- Shows order items with individual prices
- Shows product discount line if applicable
- Shows coupon discount line if applied (green, formatted)
- Shows final total
- Coupon Information card (if coupon applied)
  - Shows discount amount with green styling
  - Shows as separate card section

---

## ✅ Validation Flow

### **Coupon Validation (isValid method)**
```php
1. Check is_active == true
   ❌ Return false if inactive
2. Check expiry_date
   ❌ Return false if expired
3. Check usage_limit
   ❌ Return false if used_count >= usage_limit
4. ✅ Return true if all checks pass
```

### **Error Messages (getValidationError method)**
- "This coupon is not active."
- "This coupon has expired."
- "This coupon has reached its usage limit."

---

## 🔄 Data Flow Example

### Scenario: Customer uses 20% coupon on $100 order with $10 product discount

```
1. PRODUCT SELECTION
   ├─ Product price: Rp 100,000
   ├─ Product discount: Rp 10,000 (10% off)
   └─ Item total: Rp 90,000

2. SUBTOTAL
   └─ Rp 90,000

3. COUPON APPLICATION
   ├─ Coupon code: SAVE20
   ├─ Coupon type: percentage
   ├─ Coupon value: 20%
   ├─ Coupon discount = 90,000 × 20% = Rp 18,000
   └─ Coupon is valid ✅

4. FINAL TOTAL
   ├─ Subtotal: Rp 90,000
   ├─ Coupon discount: -Rp 18,000
   └─ FINAL: Rp 72,000

5. PAYMENT
   ├─ Xendit invoice created for Rp 72,000
   └─ Payment processed

6. SUCCESS
   ├─ Order.coupon_id = SAVE20's id
   ├─ Order.coupon_discount = 18,000
   ├─ Order.total = 72,000
   ├─ Coupon.used_count incremented
   └─ Customer email with order details
```

---

## 🎛️ Admin Panel

### Coupon Management (`/admin/coupons`)

**List Page:**
- Table with: Code, Discount, Usage, Expiry, Status, Actions
- Status badges:
  - 🟢 Active (green)
  - ⚫ Inactive (gray)
  - 🔴 Expired (red)
  - 🟡 Limit Reached (yellow)
- Edit and Delete buttons
- Pagination support

**Create Page:**
- Code input (auto uppercase, 3-50 chars, unique)
- Discount type selector (Fixed Rp / Percentage %)
- Discount value input (step 0.01, min 0.01)
- Live preview showing formatted discount
- Usage limit input (optional, NULL = unlimited)
- Expiry date picker (optional, must be future date)
- Active toggle (default true)
- Submit/Cancel buttons

**Edit Page:**
- Same as create with:
  - Prepopulated values
  - Usage tracking display
  - Cannot edit code uniqueness constraint

---

## 📊 Database Relations

```
Coupons (1) ─────────── (M) Orders
  id              coupon_id
  code
  discount_type
  discount_value
  usage_limit
  used_count
  expiry_date
  is_active

Orders (1) ─────────────── (M) OrderItems
  id             order_id
  coupon_id
  coupon_discount
  total
  status

Products (1) ─────────── (M) OrderItems
  id             product_id
  discount
  discount_type
```

---

## 🧪 Testing Scenarios

### Test Case 1: Fixed Discount Coupon
```
Product price: Rp 100,000
Coupon: 10,000 off (fixed)
Subtotal: Rp 100,000
Coupon discount: -Rp 10,000
Final: Rp 90,000 ✅
```

### Test Case 2: Percentage Discount Coupon
```
Product price: Rp 100,000
Coupon: 25% off (percentage)
Subtotal: Rp 100,000
Coupon discount: -Rp 25,000 (25% of 100,000)
Final: Rp 75,000 ✅
```

### Test Case 3: Expired Coupon
```
Coupon expiry_date: 2025-11-01
Current date: 2025-11-16
Result: ❌ Invalid - "This coupon has expired."
```

### Test Case 4: Usage Limit Reached
```
Coupon usage_limit: 5
Coupon used_count: 5
Result: ❌ Invalid - "This coupon has reached its usage limit."
```

### Test Case 5: Product Discount + Coupon
```
Product price: Rp 100,000 (with 10% product discount = Rp 10,000 off)
Product item total: Rp 90,000
Coupon: 20% off order
Subtotal: Rp 90,000
Coupon discount: -Rp 18,000 (20% of 90,000)
Final: Rp 72,000 ✅
```

---

## 📁 Files Modified/Created

### Created Files:
- `database/migrations/2025_11_16_102530_create_coupons_table.php`
- `database/migrations/2025_11_16_103051_add_coupon_to_orders_table.php`
- `app/Models/Coupon.php`
- `app/Http/Controllers/CouponController.php`
- `resources/js/pages/Coupon/Index.tsx`
- `resources/js/pages/Coupon/Create.tsx`
- `resources/js/pages/Coupon/Edit.tsx`
- `resources/js/utils/coupon.ts`

### Modified Files:
- `routes/admin.php` - Added coupon routes
- `routes/api.php` - Added coupon validation endpoint
- `app/Models/Order.php` - Added coupon_id, coupon_discount, coupon relationship
- `app/Http/Controllers/OrderController.php` - Integrated coupon logic in payOrder() and paymentSuccess()
- `resources/js/pages/Checkout.tsx` - Added coupon input and calculations
- `resources/js/pages/Order/show.tsx` - Display coupon information

---

## 🚀 Usage Instructions

### For Admins:

1. **Create Coupon:**
   - Go to `/admin/coupons`
   - Click "Create Coupon"
   - Fill in: code, discount type, amount, optional limit/expiry
   - Click "Create Coupon"

2. **Edit Coupon:**
   - Click "Edit" on any coupon
   - Modify values (except usage tracking is read-only)
   - Click "Update Coupon"

3. **Disable Coupon:**
   - Edit coupon
   - Uncheck "Active"
   - Save

4. **Delete Coupon:**
   - Click trash icon on coupon row

### For Customers:

1. **Apply Coupon:**
   - At checkout, enter coupon code in "Coupon Code" field
   - Click "Apply" button
   - Discount applies immediately if valid

2. **Remove Coupon:**
   - If applied, click "Remove" button to remove

3. **See Discount:**
   - Applied coupon shows in green box with code and discount amount
   - Final total updates to show savings

---

## ✨ Key Features

✅ **Two-tier discounting system:** Product-level + Order-level coupons
✅ **Flexible discount types:** Fixed amount (Rp) or Percentage (%)
✅ **Usage tracking:** Track how many times each coupon is used
✅ **Configurable limits:** Set max uses (or unlimited)
✅ **Expiry dates:** Set coupon expiration (or never expires)
✅ **Active toggle:** Disable without deleting
✅ **Live validation:** Validates on checkout with clear error messages
✅ **Automatic usage increment:** Only increments on successful payment
✅ **Order tracking:** See coupon discount in order details
✅ **IDR formatting:** All amounts displayed in Indonesian Rupiah (Rp)
✅ **Responsive design:** Works on all screen sizes

---

## 🔒 Security Considerations

✅ Coupon validation happens server-side (cannot be bypassed)
✅ Usage limits enforced at payment time
✅ Coupon can only be used if active and not expired
✅ Final total calculated server-side (frontend calculation for preview only)
✅ Order stores actual coupon discount amount (immutable record)
✅ Coupon usage only increments on successful payment

---

## 📊 Summary

The complete coupon system is now fully operational:
- **Backend:** Order processing accepts and validates coupons, calculates discounts, increments usage
- **Frontend:** Checkout page allows coupon input, displays savings, shows final total
- **Admin:** Full CRUD for coupon management with status tracking
- **Payment:** Final invoice reflects all discounts (product + coupon)
- **Tracking:** Order details show exact coupon discount applied

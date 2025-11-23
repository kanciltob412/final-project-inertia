# Admin Member Promo Management & Checkout Integration Guide

## Part 1: Admin Member Promo Management

### Overview

Admins can create, manage, and publish promotional content for members through a dedicated admin section. This includes news, banners, and special promotions.

### Access

- URL: `/admin/member-promos`
- Role: Admin only
- Auth: Required + Verified

---

## Features

### 1. View All Promotions (`/admin/member-promos`)

**What Admins See:**

- Table of all promotions (active and inactive)
- Promo title, type, date range, status
- Edit and delete buttons for each promo
- Bulk delete capability
- Pagination (15 per page)

**Table Columns:**

- ☑️ Select checkbox (for bulk operations)
- 📝 Title
- 🏷️ Type (News/Banner/Promotion)
- 📅 Date Range
- ✅ Status (Active/Inactive)
- ⚙️ Actions (Edit/Delete)

### 2. Create New Promotion (`/admin/member-promos/create`)

**Form Fields:**

- **Title** (required) - Promo name/headline
- **Description** (required) - Full details of the promotion
- **Type** (required) - Choose:
    - News - General announcements
    - Banner - Visual promotional banners
    - Promotion - Special offers/discounts
- **Image URL** (optional) - Link to promotional image
- **Link URL** (optional) - Where promo links to
- **Start Date** (required) - When promo goes live
- **End Date** (optional) - When promo expires
- **Display Order** - Control position (0 = first)
- **Active Toggle** - Make promo visible to customers

**Example:**

```
Title: Holiday Sale 2024
Description: Get 30% off all items from Nov 23 - Dec 25
Type: Promotion
Image URL: https://example.com/holiday-sale.jpg
Link URL: https://example.com/holiday-promo
Start Date: 2024-11-23
End Date: 2024-12-25
Display Order: 0
Is Active: ✓ Checked
```

### 3. Edit Promotion (`/admin/member-promos/{id}/edit`)

**What Can Be Updated:**

- All fields from creation
- Dates (extend or shorten promo period)
- Images and links
- Display order
- Active/inactive status

**Use Cases:**

- Extend successful promotion
- Update promotional image
- Change dates for better timing
- Reorder promotions on customer dashboard

### 4. Delete Promotion

**Single Delete:**

- Click delete button on any promo
- Confirm deletion
- Promo removed immediately

**Bulk Delete:**

- Select multiple promos with checkboxes
- Click "Delete Selected"
- Confirm deletion
- All selected promos removed

---

## How Customer Sees It

### Dashboard Promo Section (`/customer/dashboard`)

- Shows 3 featured promos from admin
- Displays based on `display_order` and `start_date`
- Only shows active promos with valid dates
- Link to view all promos

### All Promotions Page (`/member-promos`)

- Paginated list of all active promotions
- Filtered by:
    - `is_active` = true
    - `start_date` <= today
    - `end_date` >= today (or NULL)
- Grid/card layout with images
- Type badges (News, Banner, Promotion)
- Links to learn more

---

## Database Behind the Scenes

### member_promos Table

```sql
id              - Unique identifier
title           - Promo title/headline
description     - Full details
type            - news, banner, or promotion
image_url       - URL to promotional image
link_url        - Where promo links to
start_date      - Promo launch date
end_date        - Promo end date (optional)
display_order   - Sort order (lower = first)
is_active       - Whether visible to customers
created_at      - When created
updated_at      - Last modification time
```

### Query Filters

```sql
-- What shows to customers:
SELECT * FROM member_promos
WHERE is_active = true
  AND start_date <= NOW()
  AND (end_date IS NULL OR end_date >= NOW())
ORDER BY display_order ASC, created_at DESC
```

---

## Admin Workflow

### Create Promo

```
1. Go to /admin/member-promos
   ↓
2. Click "Create Promo"
   ↓
3. Fill in all fields
   ├─ Title: "Special Offer"
   ├─ Description: "Amazing deal..."
   ├─ Type: "promotion"
   ├─ Image: "https://..."
   ├─ Start: "2024-11-23"
   └─ End: "2024-12-23"
   ↓
4. Check "Make this promo active"
   ↓
5. Click "Create Promo"
   ↓
6. See success message
   ↓
7. Customers see promo on dashboard
```

### Edit Promo

```
1. Go to /admin/member-promos
   ↓
2. Find promo in table
   ↓
3. Click "Edit" button
   ↓
4. Modify fields as needed
   ↓
5. Click "Save Changes"
   ↓
6. Changes visible to customers immediately
```

### Delete Promo

```
Single Delete:
  1. Click "Delete" button
  2. Confirm in dialog
  3. Promo removed

Bulk Delete:
  1. Check boxes for multiple promos
  2. Click "Delete Selected"
  3. Confirm
  4. All removed at once
```

---

## Promo Scheduling

### Active Promo (Shows to Customers)

✅ `is_active` = true
✅ `start_date` ≤ today
✅ `end_date` ≥ today (or no end date)

### Inactive Scenarios

❌ `is_active` = false (manually disabled)
❌ `start_date` > today (not started yet)
❌ `end_date` < today (expired)

### Example Timeline

```
Promo: "Holiday Sale"
Start: Nov 15
End: Nov 30
Today: Nov 23

Status: ✅ ACTIVE (visible to customers)

Nov 14:  ❌ Not started (preview available to admin)
Nov 15:  ✅ Started (customers see it)
Nov 23:  ✅ In progress (still showing)
Nov 30:  ✅ Last day (still showing)
Dec 01:  ❌ Ended (hidden from customers)
```

---

# Part 2: Checkout Integration with Saved Addresses

## Overview

Customers can now select from saved addresses during checkout, and fields auto-fill automatically.

---

## How It Works

### 1. Saved Address Display

When a logged-in customer goes to `/checkout`:

- If they have saved addresses, a blue box appears
- Shows all saved addresses with details
- Default address is highlighted

### 2. Address Selection

Customer can:

- Click any saved address to select it
- All form fields auto-fill immediately
- Continue with checkout

### 3. Manual Address Entry

If customer wants different address:

- Can edit the auto-filled fields
- Or ignore saved addresses
- Enter new address manually

---

## Technical Implementation

### Backend

#### Address Model (Already Exists)

```php
$address->user_id           // Customer
$address->recipient_name    // Who receives
$address->phone            // Contact number
$address->street_address   // Street
$address->city             // City name
$address->postal_code      // Postal code
$address->country          // Country
$address->is_default       // Default address
```

#### API Endpoint

```
GET /api/customer/addresses
Headers: Authorization required (logged-in user)
Response: JSON array of addresses
```

#### Controller Method

```php
// In AddressController
public function list()
{
    $addresses = Auth::user()->addresses()->get();
    return response()->json($addresses);
}
```

### Frontend

#### Hook: `useSavedAddresses`

```typescript
const { addresses, loading, error } = useSavedAddresses();

// Returns:
// - addresses: Array of SavedAddress objects
// - loading: Boolean while fetching
// - error: Error message if any
```

#### Component: `SavedAddressSelector`

```tsx
<SavedAddressSelector addresses={addresses} onAddressSelect={handleAddressSelect} currentAddressId={selectedAddressId} />
```

#### Handler in Checkout

```typescript
const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);

    // Auto-fill form
    setData('full_name', address.recipient_name);
    setData('phone', address.phone);
    setData('address', address.street_address);
    setData('city', address.city);
    setData('country', address.country);
    setData('postal_code', address.postal_code);
};
```

---

## Customer Experience

### Checkout Flow with Saved Addresses

```
1. Customer logs in
   ↓
2. Goes to /checkout
   ↓
3. Sees "Your Saved Addresses" box
   (if they have any saved)
   ↓
4. Options:
   ├─ Click saved address → auto-fill form
   ├─ Edit filled fields manually
   └─ Ignore and enter new address
   ↓
5. Select shipping method
   ↓
6. Apply coupon (if any)
   ↓
7. Review order
   ↓
8. Complete payment
```

### What Saved Address Shows

```
☐ John Doe [DEFAULT]
  123 Main Street
  Jakarta, 12345
  +62 812-3456-7890

☐ Jane Doe
  456 Office Plaza
  Bandung, 40123
  +62 812-7654-3210

+ Add New Address (links to /customer/addresses)
```

---

## Database Tables

### customer_addresses

Stores all customer addresses:

```sql
id              - Primary key
user_id         - Which customer owns this
address_type    - home/office/other
recipient_name  - Who receives package
phone           - Delivery contact
street_address  - Full street address
city            - City name
state           - State/province
postal_code     - ZIP/postal code
country         - Country
notes           - Special instructions
is_default      - True if default address
created_at      - Created date
updated_at      - Modified date
```

### Usage in Checkout

1. **On page load:** Fetch addresses via `/api/customer/addresses`
2. **On selection:** Auto-fill form with selected address
3. **On submit:** Use filled data (whether from saved or manual)

---

## Integration Points

### 1. Customer Dashboard

- Link to manage addresses: `/customer/addresses`
- Shows address count in stats
- Quick access from dashboard

### 2. Checkout Page

- Show saved addresses dropdown (NEW)
- Auto-fill on selection (NEW)
- Traditional manual entry still available

### 3. Order History

- Shows which address was used
- Links to manage addresses if needed

### 4. Account Settings

- Full address CRUD in `/customer/addresses`
- Can update/delete addresses anytime

---

## Code Files Involved

### Backend

- `/app/Http/Controllers/AddressController.php`
    - `list()` method - API endpoint
- `/app/Models/Address.php` - Address model
- `/app/Models/User.php` - User relationship
- `/routes/web.php` - API route

### Frontend

- `/resources/js/hooks/useSavedAddresses.ts` - Hook for fetching
- `/resources/js/components/checkout/SavedAddressSelector.tsx` - UI component
- `/resources/js/pages/Checkout.tsx` - Integration

---

## Testing Checklist

### Admin Promo Management

- [ ] Create new promotion
- [ ] Edit existing promotion
- [ ] Delete single promotion
- [ ] Bulk delete promotions
- [ ] Verify promo shows on customer dashboard
- [ ] Verify promo shows on `/member-promos` page
- [ ] Test date filtering (should hide expired)
- [ ] Test active toggle (hidden when unchecked)

### Checkout Address Integration

- [ ] Log in as customer
- [ ] Go to `/checkout`
- [ ] See saved addresses (if any)
- [ ] Click address → fields auto-fill
- [ ] Manual edit still works
- [ ] Submit order with auto-filled address
- [ ] Order saved with correct address
- [ ] Guest checkout still works (no addresses shown)

---

## Troubleshooting

### Promos Not Showing

**Issue:** Promo created but doesn't show on dashboard

**Checklist:**

- ✅ `is_active` is checked
- ✅ `start_date` is today or earlier
- ✅ `end_date` is today or later (or empty)
- ✅ Refresh page after creating

### Addresses Not Loading in Checkout

**Issue:** No saved addresses appear

**Checklist:**

- ✅ User is logged in
- ✅ User has saved addresses (check `/customer/addresses`)
- ✅ Addresses have complete data
- ✅ API endpoint accessible: `/api/customer/addresses`
- ✅ Browser console for errors

### Auto-fill Not Working

**Issue:** Clicking address doesn't fill form

**Checklist:**

- ✅ Address selector component renders
- ✅ Handler function `handleAddressSelect` exists
- ✅ Form state updates properly
- ✅ Check browser console for errors

---

## FAQ

**Q: Can customers have unlimited addresses?**
A: Yes, no limit on number of saved addresses.

**Q: Can admin create promos for specific users?**
A: No, promos are public to all members once active.

**Q: Can promos be scheduled in advance?**
A: Yes, use `start_date` in the future to schedule.

**Q: Do expired promos disappear automatically?**
A: Customers won't see them, but admins can still edit/delete them.

**Q: Can customers change address after checkout?**
A: Not after order placed, but can use different address for next order.

**Q: Does guest checkout work?**
A: Yes, guests don't see saved addresses, only manual entry.

---

## Future Enhancements

- [ ] Bulk import addresses from CSV
- [ ] Address verification API
- [ ] Recurring promotions
- [ ] Promo analytics/tracking
- [ ] A/B testing promos
- [ ] Multi-language promo content
- [ ] Promo usage restrictions
- [ ] Address auto-complete

---

## Security Notes

✅ Authorization checks in place
✅ Only users can access their own addresses
✅ Admin role required for promo management
✅ All inputs validated server-side
✅ CSRF protection enabled
✅ Rate limiting on API endpoints

---

**Status:** ✅ Fully Implemented & Ready to Use

All admin promo management and checkout address integration is complete and production-ready.

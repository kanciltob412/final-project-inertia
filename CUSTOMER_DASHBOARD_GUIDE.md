# Customer Dashboard Implementation Guide

This document describes the new customer dashboard system that replaces the tab-based interface with dedicated pages for managing orders, wishlist, profile, and addresses.

## Features Overview

### 1. **Customer Dashboard** (`/customer/dashboard`)

Main hub for customers with:

- Welcome message personalized with customer name
- Quick stats cards (Total Orders, Wishlist items, Saved Addresses)
- Member News & Promotions section (admin-curated content)
- Recent orders preview
- Quick links to Settings and FAQ

### 2. **Orders Management** (`/customer/orders`)

- View all customer orders
- Order status display (Pending, Completed, Shipped, Cancelled)
- Order details with items preview
- Links to detailed order view

### 3. **Wishlist** (`/customer/wishlists`)

- Browse saved wishlist items with product images
- View product prices
- Remove items from wishlist
- Direct product links for quick shopping

### 4. **Profile Management** (`/customer/profile`)

- Update name and email
- Email verification status and resend option
- Link to address management
- Link to password change
- Account security options

### 5. **Address Management** (`/customer/addresses`)

- Add/Edit/Delete customer addresses
- Set address type (Home, Office, Other)
- Mark default address (used for auto-fill at checkout)
- View all saved addresses in card format
- Address details: recipient name, phone, street, city, postal code, country, notes

### 6. **Member Promotions** (`/member-promos`)

- View all active member-only promotions and news
- Filter by type (News, Banner, Promotion)
- View promotion dates and validity
- Direct links to promotions
- Paginated listing

### 7. **Admin Member Promo Management** (`/admin/member-promos`)

- Create, edit, delete member promotions
- Set promotion type (news, banner, promotion)
- Schedule start and end dates
- Upload/manage images
- Set display order
- Bulk delete operations
- Activate/deactivate promos

## Database Schema

### New Tables

#### `customer_addresses`

```sql
- id (primary key)
- user_id (foreign key -> users.id)
- address_type (enum: home, office, other)
- recipient_name (string)
- phone (string)
- street_address (string)
- city (string)
- state (string, nullable)
- postal_code (string)
- country (string)
- notes (text, nullable)
- is_default (boolean)
- created_at
- updated_at
```

#### `member_promos`

```sql
- id (primary key)
- title (string)
- description (text)
- type (enum: news, banner, promotion)
- image_url (string, nullable)
- link_url (string, nullable)
- start_date (datetime)
- end_date (datetime, nullable)
- display_order (integer)
- is_active (boolean)
- created_at
- updated_at
```

## Models

### Address Model (`app/Models/Address.php`)

- Relationship: `belongs to User`
- Fillable fields: address_type, recipient_name, phone, street_address, city, state, postal_code, country, notes, is_default

### MemberPromo Model (`app/Models/MemberPromo.php`)

- Fillable fields: title, description, type, image_url, link_url, start_date, end_date, display_order, is_active

### User Model Update

- Added `addresses()` relationship: `hasMany Address`

## Controllers

### CustomerDashboardController

- `index()`: Returns dashboard data with user stats, recent orders, and active promos

### AddressController

- `index()`: Display all user addresses
- `store(Request)`: Create new address
- `update(Request, Address)`: Update existing address
- `destroy(Address)`: Delete address
- `setDefault(Address)`: Set as default address
- `list()`: API endpoint for getting addresses (JSON)

### MemberPromoController

- `index()`: Display active member promos (paginated)

### AdminMemberPromoController

- `index()`: List all promos (admin)
- `create()`: Show create form
- `store(Request)`: Store new promo
- `edit(MemberPromo)`: Show edit form
- `update(Request, MemberPromo)`: Update promo
- `destroy(MemberPromo)`: Delete promo
- `bulkDelete(Request)`: Bulk delete promos

## Routes

### Customer Routes (Protected - auth/verified)

```
GET  /customer/dashboard                          CustomerDashboardController@index
GET  /customer/addresses                          AddressController@index
POST /customer/addresses                          AddressController@store
PUT  /customer/addresses/{address}                AddressController@update
DELETE /customer/addresses/{address}              AddressController@destroy
POST /customer/addresses/{address}/set-default    AddressController@setDefault
GET  /api/customer/addresses                      AddressController@list (JSON API)
GET  /member-promos                               MemberPromoController@index
```

### Admin Routes (Protected - admin role)

```
GET    /admin/member-promos                       AdminMemberPromoController@index
GET    /admin/member-promos/create                AdminMemberPromoController@create
POST   /admin/member-promos                       AdminMemberPromoController@store
GET    /admin/member-promos/{id}/edit             AdminMemberPromoController@edit
PUT    /admin/member-promos/{id}                  AdminMemberPromoController@update
DELETE /admin/member-promos/{id}                  AdminMemberPromoController@destroy
POST   /admin/member-promos/bulk-delete           AdminMemberPromoController@bulkDelete
```

## Frontend Components

### React Pages

#### `/resources/js/pages/Customer/Dashboard.tsx`

- Main dashboard with stats, promos, and recent orders
- Quick navigation cards
- Welcome banner

#### `/resources/js/pages/Customer/Addresses.tsx`

- Address list and management
- Add/Edit form toggle
- Default address indicator

#### `/resources/js/pages/Customer/Orders.tsx`

- Orders table/list view
- Status indicators
- Order details links

#### `/resources/js/pages/Customer/Wishlists.tsx`

- Wishlist grid/card view
- Product images and prices
- Remove functionality

#### `/resources/js/pages/Customer/Profile.tsx`

- Profile information form
- Email verification status
- Links to address and password management

#### `/resources/js/pages/Customer/MemberPromo.tsx`

- Member promo listing with filters
- Type badges and dates
- Pagination support

#### `/resources/js/pages/Admin/MemberPromo/Index.tsx`

- Admin promo management table
- Bulk actions
- Edit/Delete operations

#### `/resources/js/pages/Admin/MemberPromo/Create.tsx`

- Create new promo form

#### `/resources/js/pages/Admin/MemberPromo/Edit.tsx`

- Edit existing promo form

### React Components

#### `/resources/js/components/customer/AddressForm.tsx`

- Reusable address form for adding/editing
- Handles validation
- Set as default option

## Checkout Integration

The checkout page can now use saved addresses in the future by:

1. Fetching addresses via `/api/customer/addresses` endpoint
2. Allowing customers to select a saved address
3. Auto-filling form fields from selected address

## Setup Instructions

### 1. Run Migrations

```bash
php artisan migrate
```

This will create:

- `customer_addresses` table
- `member_promos` table

### 2. Add Navigation Links

Update your main navigation to include links to:

- `/customer/dashboard` (Customer Dashboard)
- `/customer/addresses` (My Addresses)
- `/member-promos` (Member Offers)

### 3. Update Navigation/Sidebar

For admin, add link to:

- `/admin/member-promos` (Member Promo Management)

## Usage Examples

### Customer Adding an Address

1. Go to `/customer/addresses`
2. Click "Add New Address"
3. Fill form with address details
4. Check "Set as default" if desired
5. Click "Add Address"

### Admin Creating a Promotion

1. Go to `/admin/member-promos`
2. Click "Create Promo"
3. Fill in:
    - Title
    - Description
    - Type (News/Banner/Promotion)
    - Upload image URL
    - Link URL
    - Start date (required)
    - End date (optional)
    - Display order
4. Check "Make this promo active"
5. Click "Create Promo"

### Checkout with Saved Address (Future Implementation)

1. Customer goes to checkout
2. Logged-in customers see "Use Saved Address" option
3. Select from dropdown
4. Form auto-fills from selected address
5. Proceed to payment

## Security Considerations

1. **Authorization**: All address operations check if address belongs to logged-in user
2. **Authentication**: Customer routes require `auth` and `verified` middleware
3. **Admin Protection**: Promo management requires admin role via `checkAdmin` middleware
4. **Validation**: All inputs validated on backend before saving

## Future Enhancements

1. **Address Validation**: Integrate with address validation API
2. **Default Address Auto-fill**: Auto-fill checkout from default address
3. **Checkout Integration**: Full integration with checkout flow
4. **Email Notifications**: Notify admins when promos expire
5. **Analytics**: Track promo views and clicks
6. **Multi-language Support**: Translate promo content
7. **Address Book Sharing**: Share addresses between accounts
8. **Import Addresses**: CSV import for bulk addresses

## Troubleshooting

### Addresses not showing

- Check user is authenticated
- Verify `addresses()` relationship exists on User model
- Run migration: `php artisan migrate`

### Promo not visible to customers

- Verify `is_active` is checked
- Check `start_date` is not in the future
- Check `end_date` hasn't passed (if set)

### Admin routes not accessible

- Verify logged-in user has `ADMIN` role
- Check `checkAdmin` middleware is applied
- Verify user exists in database

## API Endpoints

### Get Customer Addresses (JSON)

```
GET /api/customer/addresses
Authorization: Bearer {token}
Response: [
  {
    "id": 1,
    "address_type": "home",
    "recipient_name": "John Doe",
    "phone": "+62812345678",
    "street_address": "Jl. Main St",
    "city": "Jakarta",
    "postal_code": "12345",
    "country": "Indonesia",
    "is_default": true
  }
]
```

## File Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── CustomerDashboardController.php
│       ├── AddressController.php
│       ├── MemberPromoController.php
│       └── Admin/
│           └── AdminMemberPromoController.php
├── Models/
│   ├── Address.php
│   └── MemberPromo.php

database/
└── migrations/
    ├── 2024_11_23_create_customer_addresses_table.php
    └── 2024_11_23_create_member_promos_table.php

resources/
└── js/
    ├── pages/
    │   ├── Customer/
    │   │   ├── Dashboard.tsx
    │   │   ├── Addresses.tsx
    │   │   ├── Orders.tsx
    │   │   ├── Wishlists.tsx
    │   │   ├── Profile.tsx
    │   │   └── MemberPromo.tsx
    │   └── Admin/
    │       └── MemberPromo/
    │           ├── Index.tsx
    │           ├── Create.tsx
    │           └── Edit.tsx
    └── components/
        └── customer/
            └── AddressForm.tsx

routes/
└── web.php (updated with new routes)
```

---

## Implementation Summary

This new customer dashboard provides a complete solution for:
✅ Managing customer addresses with default address selection
✅ Viewing orders and wishlist in dedicated pages
✅ Admin control over member promotions and news
✅ Professional UI with clear navigation
✅ Future-proof checkout integration with saved addresses
✅ Secure authorization and authentication

The system is modular, scalable, and ready for the checkout integration to auto-fill addresses during the purchase process.

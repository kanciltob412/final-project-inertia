# Quick Setup Guide - Customer Dashboard

## What Was Built

A complete customer dashboard system replacing tab-based interface with dedicated pages for:

- ✅ **Orders Management** - View, track, and manage all orders
- ✅ **Wishlist** - Save and manage favorite products
- ✅ **Addresses** - Add, edit, delete, and set default shipping addresses
- ✅ **Profile** - Update personal information
- ✅ **Member Promotions** - View admin-created news and promotions
- ✅ **Admin Promo Management** - Create/edit/delete member promotions

## Installation Steps

### Step 1: Run Database Migrations

```bash
php artisan migrate
```

This creates two new tables:

- `customer_addresses` - Stores customer shipping addresses
- `member_promos` - Stores admin promotions and news

### Step 2: Clear Cache (Optional but Recommended)

```bash
php artisan cache:clear
php artisan config:cache
```

### Step 3: Build Frontend

```bash
npm run build
```

## File Changes Overview

### New Files Created

**Backend:**

- `/app/Http/Controllers/CustomerDashboardController.php`
- `/app/Http/Controllers/AddressController.php`
- `/app/Http/Controllers/MemberPromoController.php`
- `/app/Http/Controllers/Admin/AdminMemberPromoController.php`
- `/app/Models/Address.php`
- `/app/Models/MemberPromo.php`
- Database migrations (2 new tables)

**Frontend - React Components:**

- `/resources/js/pages/Customer/Dashboard.tsx` - Main dashboard hub
- `/resources/js/pages/Customer/Addresses.tsx` - Address management
- `/resources/js/pages/Customer/Orders.tsx` - Orders listing
- `/resources/js/pages/Customer/Wishlists.tsx` - Wishlist display
- `/resources/js/pages/Customer/Profile.tsx` - Profile settings
- `/resources/js/pages/Customer/MemberPromo.tsx` - Member promotions
- `/resources/js/pages/Admin/MemberPromo/Index.tsx` - Admin promo list
- `/resources/js/pages/Admin/MemberPromo/Create.tsx` - Create promo
- `/resources/js/pages/Admin/MemberPromo/Edit.tsx` - Edit promo
- `/resources/js/components/customer/AddressForm.tsx` - Reusable address form

### Modified Files

- `/app/Models/User.php` - Added `addresses()` relationship
- `/routes/web.php` - Added new routes for customer and admin sections
- `/database/migrations/` - Added migrations folder

## Navigation Links to Add

Add these links to your main navigation/header:

```
Customer Routes (require auth):
- Dashboard: /customer/dashboard
- My Addresses: /customer/addresses
- My Orders: /customer/orders (already exists, link it from dashboard)
- My Wishlist: /customer/wishlists
- My Profile: /customer/profile
- Member Offers: /member-promos

Admin Routes (require admin role):
- Member Promos: /admin/member-promos
```

## Key Features

### 1. Address Management

- Add multiple delivery addresses
- Set one as default (auto-fill in future checkout)
- Edit or delete addresses
- Full address details: recipient name, phone, street, city, state, postal code, country, notes

### 2. Member Promotions (Admin)

- Create news, banners, or promotions
- Schedule start/end dates
- Upload images and links
- Set display order
- Bulk operations (delete multiple)
- Toggle active/inactive status

### 3. Dashboard Overview

- Quick stats (orders count, wishlist items, saved addresses)
- Recent orders preview
- Featured member promotions
- Quick access links

### 4. Profile Management

- Update name and email
- Email verification status
- Links to address and password management
- Security options

## API Endpoints

For programmatic access to customer addresses (useful for checkout integration):

```
GET /api/customer/addresses
Headers: Authorization: Bearer {token}

Returns JSON array of customer's addresses:
[
  {
    "id": 1,
    "address_type": "home",
    "recipient_name": "John Doe",
    "phone": "+62812345678",
    "street_address": "123 Main St",
    "city": "Jakarta",
    "postal_code": "12345",
    "country": "Indonesia",
    "is_default": true
  }
]
```

## Next Steps (Optional Enhancements)

### Checkout Integration

To auto-fill addresses during checkout:

1. Fetch addresses from `/api/customer/addresses`
2. Show dropdown in checkout form
3. Auto-fill selected address fields

### Example Code for Checkout:

```typescript
// In Checkout component
const [addresses, setAddresses] = useState([]);

useEffect(() => {
  if (auth.user) {
    fetch('/api/customer/addresses')
      .then(r => r.json())
      .then(data => setAddresses(data));
  }
}, []);

// Add select dropdown in form:
<select onChange={(e) => {
  const address = addresses.find(a => a.id === parseInt(e.target.value));
  setData({
    recipient_name: address.recipient_name,
    phone: address.phone,
    address: address.street_address,
    city: address.city,
    postal_code: address.postal_code,
    country: address.country,
  });
}}>
  <option value="">Select Address</option>
  {addresses.map(addr => (
    <option value={addr.id}>{addr.recipient_name} - {addr.street_address}</option>
  ))}
</select>
```

## Testing

### Test Customer Flows:

1. Create a test account (if not logged in)
2. Go to `/customer/dashboard`
3. Navigate to `/customer/addresses` and add an address
4. Check `/customer/orders` (should show existing orders)
5. Check `/customer/wishlists` (should show saved items)
6. Go to `/customer/profile` to update info
7. Visit `/member-promos` to see promotions

### Test Admin Flows:

1. Log in as admin account
2. Go to `/admin/member-promos`
3. Create a new promotion with:
    - Title: "Holiday Sale"
    - Type: "promotion"
    - Start date: Today
    - Image URL: (any image URL)
4. Verify it appears on customer `/member-promos` page

## Troubleshooting

### Addresses not showing

```bash
# Check migrations ran
php artisan migrate:status

# Re-run if needed
php artisan migrate
```

### Routing not working

```bash
# Clear route cache
php artisan route:clear
php artisan route:cache
```

### Frontend not updating

```bash
# Rebuild assets
npm run build

# Or dev mode with watch
npm run dev
```

### Authorization errors

- Ensure user is authenticated (logged in)
- For admin features, verify user has `ADMIN` role
- Check `auth.verified` middleware is enabled

## Database Backup (Before Migration)

```bash
# Create backup
php artisan backup:run

# Or manual MySQL
mysqldump -u root lavanya_ceramics > backup_$(date +%Y%m%d).sql
```

## Support & Issues

If you encounter issues:

1. Check Laravel logs: `/storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify migrations: `php artisan migrate:status`
4. Check user has correct role for admin features

## File Documentation

For detailed technical documentation, see:

- `CUSTOMER_DASHBOARD_GUIDE.md` - Complete technical guide with schema and architecture
- Individual component files have inline comments

---

**Status:** ✅ Ready for deployment

**What's working:**

- ✅ Customer dashboard pages
- ✅ Address management (add/edit/delete)
- ✅ Member promotions (admin create/edit/delete)
- ✅ Orders and wishlist display
- ✅ Profile management
- ✅ All routes and API endpoints
- ✅ Authorization and authentication

**Ready for next phase:**

- ⏳ Checkout integration with auto-fill addresses
- ⏳ Email notifications for promos
- ⏳ Analytics tracking

# Checkout Address Autofill Enhancement Guide

## Overview
The checkout page now provides intelligent address handling for logged-in users with automatic autofill and flexible address selection options.

## Features Implemented

### 1. **Automatic Address Autofill**
When a logged-in user navigates to the checkout page:
- Their default saved address automatically populates the form
- All address fields (street, city, postal code, etc.) are pre-filled
- User's name is automatically populated from their profile
- If no default address exists, the first saved address is used

**Technical Implementation:**
```typescript
// Auto-fill user's default address when they log in
useEffect(() => {
    if (auth.user && addresses && addresses.length > 0 && !selectedAddressId) {
        // Auto-fill user's name if not already filled
        if (!data.full_name && auth.user.name) {
            setData('full_name', auth.user.name);
        }

        // Find the default address or use the first one
        const defaultAddress = addresses.find((addr: SavedAddress) => addr.is_default) || addresses[0];
        if (defaultAddress) {
            handleAddressSelect(defaultAddress);
        }
    }
}, [auth.user?.id, addresses.length, addresses]);
```

### 2. **SavedAddressSelector Component**
When logged-in users with saved addresses visit checkout:
- A visual list of saved addresses is displayed
- Users can select any saved address with a single click
- Current selected address is highlighted
- Selected address auto-fills all form fields

### 3. **"Use Different Address" Option**
Users can easily enter a new address:
```tsx
{auth.user && addresses.length > 0 && !useNewAddress && (
    <button
        type="button"
        onClick={() => setUseNewAddress(true)}
        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
        + Use a Different Address
    </button>
)}
```

When clicked:
- SavedAddressSelector is hidden
- Manual address entry form is displayed
- User can enter complete new address details
- Form fields are ready for manual input

### 4. **"Back to Saved Addresses" Navigation**
Users can easily return to their saved addresses:
```tsx
{auth.user && addresses.length > 0 && useNewAddress && (
    <button
        type="button"
        onClick={() => {
            setUseNewAddress(false);
            setSelectedAddressId(addresses[0]?.id || null);
        }}
        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
    >
        ← Back to Saved Addresses
    </button>
)}
```

When clicked:
- Manual form is hidden
- SavedAddressSelector is displayed again
- First saved address is auto-selected
- User can choose a different address

## State Management

### Key State Variables
```typescript
// Track whether to show saved addresses or new address form
const [useNewAddress, setUseNewAddress] = useState(false);

// Track which saved address is currently selected
const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

// Fetched addresses from /api/customer/addresses
const [loadedAddresses, setLoadedAddresses] = useState<SavedAddress[]>([]);
```

### Address Fetching
```typescript
// Refetch addresses when user logs in
useEffect(() => {
    if (auth.user) {
        const fetchAddresses = async () => {
            try {
                const response = await fetch('/api/customer/addresses');
                if (response.ok) {
                    const data = await response.json();
                    setLoadedAddresses(data);
                }
            } catch (err) {
                console.error('Failed to fetch addresses:', err);
            }
        };
        fetchAddresses();
    }
}, [auth.user?.id]);
```

## User Experience Flow

### For Logged-in Users with Saved Addresses:
1. User navigates to checkout
2. Page loads and fetches saved addresses from `/api/customer/addresses`
3. Default address automatically pre-fills form
4. User sees "SavedAddressSelector" component with all saved addresses
5. User can:
   - **Option A:** Accept default address and proceed to shipping
   - **Option B:** Click "Use Different Address" to enter new address
   - **Option C:** Select different address from SavedAddressSelector

### For Logged-in Users without Saved Addresses:
1. User navigates to checkout
2. Shipping details form is displayed
3. User enters new address manually
4. User can save this address if they choose

### For Guest Users:
1. User navigates to checkout
2. Sees login/register suggestion banner
3. Can either login or continue as guest
4. Manually enters shipping details
5. No address autofill available

## API Endpoints Used

### Fetch Saved Addresses
- **Endpoint:** `GET /api/customer/addresses`
- **Auth:** Required (logged-in users only)
- **Response:** Array of SavedAddress objects
```typescript
interface SavedAddress {
    id: number;
    user_id: number;
    full_name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}
```

## Components Involved

1. **Checkout.tsx** - Main checkout page component
   - Manages address autofill logic
   - Handles toggle between saved/new addresses
   - Processes checkout form submission

2. **SavedAddressSelector.tsx** - Address selection component
   - Displays list of saved addresses
   - Handles address selection clicks
   - Shows visual indication of selected address

3. **useSavedAddresses() Hook** - Custom hook
   - Fetches saved addresses on mount
   - Provides address data to components

## Error Handling

### Address Fetch Errors
If address fetch fails:
- Error is logged to console
- Manual address entry form is still available
- User can proceed by entering address manually

### Missing Addresses
If user has no saved addresses:
- SavedAddressSelector is not displayed
- Manual address entry form is shown directly
- User can enter new address

## Testing Scenarios

### Test Case 1: Auto-fill with Default Address
1. Login with user account that has saved addresses
2. Navigate to checkout
3. Verify default address is selected in form
4. Verify all fields are pre-filled
5. Proceed to shipping

### Test Case 2: Switch to Different Saved Address
1. Login and navigate to checkout
2. Click on different address in SavedAddressSelector
3. Verify form updates with new address details
4. Proceed to shipping

### Test Case 3: Enter New Address
1. Login and navigate to checkout
2. Click "Use Different Address"
3. Verify SavedAddressSelector is hidden
4. Verify manual entry form is displayed
5. Enter new address and proceed

### Test Case 4: Return to Saved Addresses
1. Login and navigate to checkout
2. Click "Use Different Address"
3. Enter new address details
4. Click "Back to Saved Addresses"
5. Verify SavedAddressSelector is displayed again
6. Verify first address is auto-selected

### Test Case 5: Guest Checkout
1. Don't login
2. Navigate to checkout
3. Verify login/register banner is shown
4. Verify no SavedAddressSelector appears
5. Manually enter address and proceed

## Future Enhancement Ideas

1. **Address Validation** - Validate address format and postal codes
2. **Edit Address** - Allow quick editing of saved addresses from checkout
3. **Add New Address** - Option to save new address after checkout
4. **Address Search** - Search/filter saved addresses list
5. **Location Autocomplete** - Google Places or similar integration
6. **Map Preview** - Show map preview of delivery address

## Troubleshooting

### Addresses Not Loading
**Problem:** SavedAddressSelector doesn't appear even for logged-in users
**Solutions:**
1. Check if `/api/customer/addresses` endpoint is working
2. Verify user is properly authenticated
3. Check browser console for fetch errors
4. Verify user actually has saved addresses in database

### Auto-fill Not Working
**Problem:** Default address doesn't auto-select
**Solutions:**
1. Check if user has a default address set
2. Verify addresses are being fetched correctly
3. Check if auth.user?.id is properly set
4. Look for errors in browser console

### Toggle Not Working
**Problem:** Can't switch between saved/new address modes
**Solutions:**
1. Check if buttons are clickable (CSS/z-index issues)
2. Verify setUseNewAddress state is being called
3. Check browser console for JavaScript errors
4. Refresh page and try again

## Files Modified

- `resources/js/pages/Checkout.tsx` - Main checkout page with autofill logic
- `resources/js/components/checkout/SavedAddressSelector.tsx` - Address selector component
- `resources/js/hooks/useSavedAddresses.ts` - Hook for fetching addresses

## Commits
- **Latest:** Improve checkout address handling - add toggle for saved addresses vs new address, better autofill logic

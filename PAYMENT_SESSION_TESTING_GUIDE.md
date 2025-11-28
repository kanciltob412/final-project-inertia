# Payment Session Logout - Testing Guide

## Overview

This guide explains how to test the payment session fix to ensure users remain logged in after completing payment.

## What Was Fixed

Previously, when users completed a payment via Xendit and returned to the app, they would be logged out. This has been fixed by:

1. Automatically re-authenticating users when they return from payment
2. Improving the PaymentSuccess component to handle session restoration
3. Adding fallback page reload mechanism if needed

## Testing Scenarios

### Scenario 1: Authenticated User - Successful Payment

**Objective**: Verify that an authenticated user remains logged in after successful payment

**Steps**:

1. Navigate to your app and click "Login"
2. Enter your credentials and log in successfully
3. Verify you see your name/email in the navbar
4. Click "Shop" and add 1-2 items to cart
5. Click "Cart" then "Checkout"
6. Fill in all required checkout information
7. Select shipping method
8. Review order summary
9. Click "Place Order" / "Proceed to Payment"
10. You will be redirected to Xendit payment gateway
11. **Important**: In test mode, use test card details or complete the payment
12. After payment success, you'll return to `/payment-success?order_id=X`
13. Wait for page to load (may take 1-2 seconds for session restoration)

**Expected Results**:

- ✅ See "Payment Successful" message
- ✅ Your email/name appears under the order ID
- ✅ Navbar shows you're still logged in (user name visible)
- ✅ Can click "View Order" and see full order details
- ✅ Can navigate to customer dashboard without re-login
- ✅ Remaining logged in when visiting home page

**Logging Indicators**:
Check your app logs for these messages:

```
[info] Order marked as paid • order_id: XXX
[info] User session restored after payment • user_id: X • order_id: XXX
[info] Order confirmation email sent to customer: email@example.com
```

---

### Scenario 2: Guest User - Successful Payment

**Objective**: Verify guest checkout works and user can view order

**Steps**:

1. Do NOT log in - remain as guest
2. Add items to cart
3. Go to checkout
4. Fill in email address (NEW or existing) and details
5. Select shipping method
6. Click "Place Order" / "Proceed to Payment"
7. Complete Zendit payment
8. Return to success page

**Expected Results**:

- ✅ See "Payment Successful" message
- ✅ Can click "View Order" and see order details
- ✅ No requirement to be logged in to view guest order
- ✅ Success page displays properly

---

### Scenario 3: Authentication Verification

**Objective**: Verify authentication state is properly detected and displayed

**Steps**:

1. Complete Scenario 1 (authenticated user payment)
2. On the success page, check:
    - User email appears under order ID
    - Navbar shows you're logged in
3. Open browser DevTools (F12) → Console
4. Look for log messages like:
    - "Reloading page to establish session..."
5. Check that page doesn't unnecessarily reload if session was already restored

**Expected Results**:

- ✅ No page reload if user is already authenticated
- ✅ Page reloads only if session was lost
- ✅ Authentication status accurately displayed

---

### Scenario 4: Failed Payment

**Objective**: Verify proper handling if user cancels payment

**Steps**:

1. Login or proceed as guest
2. Add items and go to checkout
3. Complete checkout to reach Xendit
4. On Xendit payment page, click "Cancel" or close without paying
5. You may be redirected to `/payment-failed` or back to app

**Expected Results**:

- ✅ Appropriate error/cancellation message displayed
- ✅ User is NOT logged out (if was logged in)
- ✅ Can return to cart or try again
- ✅ Order remains in system (status: PENDING)

---

### Scenario 5: Order Tracking

**Objective**: Verify user can track their order after payment

**Steps**:

1. Complete successful payment (Scenario 1)
2. From success page, click "View Order"
3. Order details page loads
4. Verify all information is correct:
    - Order ID
    - Items ordered
    - Shipping address
    - Order status (should be "PAID")
5. Navigate to Customer Dashboard (if logged in)
6. Verify order appears in "My Orders" list

**Expected Results**:

- ✅ Order details page accessible
- ✅ All order information correct
- ✅ Order status shows as "PAID"
- ✅ Order appears in customer dashboard
- ✅ User remains authenticated throughout

---

## Browser Console Verification

When testing, open Browser DevTools (F12 → Console) and look for:

### Success Indicators:

```javascript
// Should see these logs:
'Redirecting to payment gateway: https://app.xendit.co/invoices/...';
'User session restored after payment';
```

### Error Indicators (would indicate issues):

```javascript
// If you see these, something may be wrong:
'User not authenticated after payment, scheduling page reload...';
// Then:
'Reloading page to establish session...';
```

The second message is normal - it's a fallback mechanism. But ideally, the user should stay authenticated on first return.

---

## Debugging Tips

### If User Gets Logged Out After Payment:

1. **Check Logs**:
    - Look in `storage/logs/laravel.log`
    - Search for "session restored" or "paid"
    - Note any error messages

2. **Check Browser Cookies**:
    - Open DevTools → Application → Cookies
    - Look for cookie named `laravel_session` (or similar)
    - Should exist before and after payment redirect

3. **Check Session Table**:
    - Database should have entry in `sessions` table
    - Session should still exist after returning from payment

4. **Clear Browser Cache**:
    - Sometimes old session data in cache causes issues
    - Clear cache: DevTools → Application → Clear All

### If Page Reloads Unnecessarily:

This is normal but can be improved. The reload happens when:

- Session was lost during payment redirect
- Fallback mechanism is restoring it

If reloads are too frequent:

1. Check if session driver is set to "database" (not "file")
2. Verify SESSION_LIFETIME is reasonable (e.g., 120 minutes)
3. Check if server time is correct (affects session expiry)

---

## Production Deployment Notes

Before deploying to production:

1. **Test with Real Xendit Credentials**:
    - Use production Xendit API keys
    - Test with real payment methods if possible

2. **Verify Session Configuration**:
    - Check `config/session.php`
    - Current settings work for most cases
    - May need adjustment for `same_site` depending on HTTPS setup

3. **Monitor Logs**:
    - Watch for "session restored" logs
    - Watch for re-authentication errors
    - Set up alerts if errors spike

4. **User Communication**:
    - Inform users their session will be maintained after payment
    - Provide support channel if issues occur

---

## Common Issues & Solutions

| Issue                          | Cause                        | Solution                                          |
| ------------------------------ | ---------------------------- | ------------------------------------------------- |
| User logged out after payment  | Session lost during redirect | User gets auto re-logged in, page may reload once |
| Page keeps reloading           | Session restoration fallback | Check browser cache, verify session driver        |
| Can't view order after payment | Authorization issue          | Check order user_id matches auth user             |
| Email not being sent           | Mail configuration           | Verify MAIL\_\* env variables, check queue        |
| Order not marked as paid       | Payment webhook issue        | Verify webhook secret, check Xendit logs          |

---

## Success Criteria Checklist

After testing, verify:

- [ ] Authenticated user stays logged in after payment
- [ ] Order is created and marked as PAID
- [ ] Confirmation email sent to user
- [ ] Admin notification email sent
- [ ] User can view order without re-login
- [ ] User can access customer dashboard
- [ ] Cart is emptied after payment
- [ ] Session logs show proper restoration
- [ ] No critical errors in application logs
- [ ] Guest user can view order after payment
- [ ] Failed payment doesn't break session
- [ ] Page doesn't reload unnecessarily

---

## Performance Impact

Changes have minimal performance impact:

- One additional database query to re-authenticate (negligible)
- One potential page reload (only if session was lost)
- No additional API calls
- No changes to payment processing speed

---

## Additional Resources

See also:

- `PAYMENT_SESSION_FIX.md` - Technical details of the fix
- `config/session.php` - Session configuration
- `app/Http/Controllers/OrderController.php` - paymentSuccess() method
- `resources/js/pages/PaymentSuccess.tsx` - Frontend handling

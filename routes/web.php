<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GetInTouchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RajaOngkirController;
use App\Http\Controllers\CouponController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NewsletterController;
use App\Models\NewsletterSubscription;
use App\Mail\WelcomeNewsletterSubscriber;
use App\Mail\AdminNewsletterNotification;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/products', [PageController::class, 'products'])->name('products');
Route::get('/products/{id}', [PageController::class, 'productDetail'])->name('product.detail');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/cart', [PageController::class, 'cart'])->name('cart');
Route::get('/checkout', [PageController::class, 'checkout'])->name('checkout');
Route::get('/articles', [PageController::class, 'articles'])->name('articles');
Route::get('/articles/{id}', [PageController::class, 'articleDetail'])->name('article.detail');
Route::get('/craftsmanship', [PageController::class, 'craftsmanship'])->name('craftsmanship');
Route::get('/shipping-info', [PageController::class, 'shippingInfo'])->name('shipping-info');
Route::get('/returns', [PageController::class, 'returns'])->name('returns');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('privacy-policy');
Route::get('/terms-of-service', [PageController::class, 'termsOfService'])->name('terms-of-service');
Route::get('/cookies-policy', [PageController::class, 'cookiesPolicy'])->name('cookies-policy');
Route::get('/shipping-test', fn() => inertia('ShippingTest'))->name('shipping-test');

Route::prefix('admin')->middleware(['auth', 'verified', 'checkAdmin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::post('products/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::patch('products/bulk-update', [ProductController::class, 'bulkUpdate'])->name('products.bulk-update');
    Route::resource('products', ProductController::class);
    Route::post('articles/duplicate', [ArticleController::class, 'duplicate'])->name('articles.duplicate');
    Route::resource('articles', ArticleController::class);
    Route::patch('articles/bulk-update', [ArticleController::class, 'bulkUpdate'])->name('articles.bulk-update');
    Route::post('orders/duplicate', [OrderController::class, 'duplicate'])->name('orders.duplicate');
    Route::patch('orders/bulk-update', [OrderController::class, 'bulkUpdate'])->name('orders.bulk-update');
    Route::resource('orders', OrderController::class);

    // Coupon Management
    Route::resource('coupons', CouponController::class);

    // Newsletter Management
    Route::get('newsletter', [NewsletterController::class, 'index'])->name('newsletter.index');
    Route::get('newsletter/export', [NewsletterController::class, 'export'])->name('newsletter.export');

    // Bulk Operations (must come before parameterized routes)
    Route::delete('newsletter/bulk', [NewsletterController::class, 'bulkDelete'])->name('newsletter.bulk-delete');
    Route::post('newsletter/bulk', [NewsletterController::class, 'bulkDelete'])->name('newsletter.bulk-delete-post');

    // Individual newsletter subscription routes (parameterized routes last)
    Route::delete('newsletter/{subscription}', [NewsletterController::class, 'destroy'])->name('newsletter.destroy');
});

// Guest checkout allowed - no auth required
Route::post('orders/pay', [OrderController::class, 'payOrder'])->name('orders.pay');
// Allow guests to view their orders
Route::get('/admin/orders/{order}', [OrderController::class, 'show'])->name('orders.show')->withoutMiddleware(['auth', 'verified', 'checkAdmin']);

// Customer order view route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('customer.order.show');
});

// Payment callback routes (no auth required for Xendit callbacks)
Route::get('/payment-success', [OrderController::class, 'paymentSuccess'])->name('payment.success');
Route::get('/payment-failed', [OrderController::class, 'paymentFailed'])->name('payment.failed');

Route::get('/user', [UserController::class, 'index']);
Route::get('/user/{id}', [UserController::class, 'show']);
Route::get('/get-in-touch', GetInTouchController::class);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');



if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}

// Test routes for email templates (remove in production)
if (config('app.debug')) {
    Route::get('/test-newsletter-email', function () {
        $subscription = new NewsletterSubscription();
        $subscription->email = 'test@example.com';
        $subscription->created_at = now();

        return view('emails.newsletter.welcome', compact('subscription'));
    });

    Route::get('/test-admin-email', function () {
        $subscription = new NewsletterSubscription();
        $subscription->email = 'test@example.com';
        $subscription->created_at = now();

        return view('emails.newsletter.admin-notification', compact('subscription'));
    });

    // Test route for admin newsletter (bypasses auth)
    Route::get('/test-admin-newsletter', [NewsletterController::class, 'index']);

    // Test route for user registration email
    Route::get('/test-user-registration-email', function () {
        $user = App\Models\User::first();
        return view('emails.admin.user-registration', compact('user'));
    });

    // Test routes for order emails
    Route::get('/test-order-confirmation-email', function () {
        $order = App\Models\Order::with(['user', 'items.product'])->first();
        return view('emails.orders.confirmation', compact('order'));
    });

    Route::get('/test-order-failed-email', function () {
        $order = App\Models\Order::with(['user', 'items.product'])->first();
        return view('emails.orders.failed', compact('order'));
    });

    Route::get('/test-admin-order-email/{type}', function ($type) {
        $order = App\Models\Order::with(['user', 'items.product'])->first();
        return view('emails.orders.admin-notification', compact('order', 'type'));
    });
}

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

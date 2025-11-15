<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GetInTouchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NewsletterController;

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

Route::prefix('admin')->middleware(['auth', 'verified', 'checkAdmin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::post('products/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::resource('products', ProductController::class);
    Route::patch('products/bulk-update', [ProductController::class, 'bulkUpdate'])->name('products.bulk-update');
    Route::post('articles/duplicate', [ArticleController::class, 'duplicate'])->name('articles.duplicate');
    Route::resource('articles', ArticleController::class);
    Route::patch('articles/bulk-update', [ArticleController::class, 'bulkUpdate'])->name('articles.bulk-update');
    Route::post('orders/duplicate', [OrderController::class, 'duplicate'])->name('orders.duplicate');
    Route::patch('orders/bulk-update', [OrderController::class, 'bulkUpdate'])->name('orders.bulk-update');
    Route::resource('orders', OrderController::class);

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

Route::middleware(['auth', 'verified'])->group(function () {
    // Other authenticated routes can be added here
});

// Payment callback routes (no auth required for Xendit callbacks)
Route::get('/payment-success', [OrderController::class, 'paymentSuccess'])->name('payment.success');
Route::get('/payment-failed', [OrderController::class, 'paymentFailed'])->name('payment.failed');

Route::get('/user', [UserController::class, 'index']);
Route::get('/user/{id}', [UserController::class, 'show']);
Route::get('/get-in-touch', GetInTouchController::class);



if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

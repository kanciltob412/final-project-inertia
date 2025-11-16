<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\CouponController;

Route::prefix('admin')->group(function () {

    Route::get('/categories', function () {
        return 'Admin - Categories Page';
    });

    Route::get('/products', function () {
        return 'Admin - Products Page';
    });

    Route::get('/users/{namauser}', function ($namauser) {
        return 'Admin - User: ' . e($namauser);
    });

    // Newsletter admin routes
    Route::get('/newsletter', [NewsletterController::class, 'index'])->name('admin.newsletter.index');
    Route::delete('/newsletter/{id}', [NewsletterController::class, 'destroy'])->name('admin.newsletter.destroy');
    Route::post('/newsletter/bulk', [NewsletterController::class, 'bulkDelete'])->name('admin.newsletter.bulk');
    Route::get('/newsletter/export', [NewsletterController::class, 'export'])->name('admin.newsletter.export');

    // Coupon admin routes
    Route::resource('coupons', CouponController::class);

    // Order shipping routes
    Route::post('/orders/{id}/ship', [\App\Http\Controllers\OrderController::class, 'markAsShipped'])->name('admin.orders.ship');
});

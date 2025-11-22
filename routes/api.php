<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\RajaOngkirController;
use App\Http\Controllers\CouponController;

Route::post('login', [AuthController::class, 'login'])->name('api.login');
Route::post('register', [AuthController::class, 'register'])->name('api.register');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('profile', [AuthController::class, 'profile'])->name('api.profile');
});

Route::post('webhook/orders', [PaymentController::class, 'webhookPayment'])->name('api.payment.webhook');

// Newsletter subscription
Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// RajaOngkir Shipping API routes (public, no auth required)
Route::prefix('shipping')->group(function () {
    Route::get('provinces', [RajaOngkirController::class, 'getProvinces'])->name('shipping.provinces');
    Route::post('cities', [RajaOngkirController::class, 'getCities'])->name('shipping.cities');
    Route::post('calculate', [RajaOngkirController::class, 'calculateShipping'])->name('shipping.calculate');
    Route::post('multiple-costs', [RajaOngkirController::class, 'getMultipleShippingCosts'])->name('shipping.multiple-costs');
    Route::get('couriers', [RajaOngkirController::class, 'getAvailableCouriers'])->name('shipping.couriers');
});

// Coupon API routes (public, no auth required)
Route::prefix('coupons')->group(function () {
    Route::post('validate', [CouponController::class, 'validate'])->name('coupons.validate');
});

<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GetInTouchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PageController;
use App\Http\Controllers\OrderController;

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

Route::prefix('admin')->middleware(['auth', 'verified', 'checkAdmin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('articles', ArticleController::class);
    Route::resource('orders', OrderController::class);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('orders/pay', [OrderController::class, 'payOrder'])->name('orders.pay');
});

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

<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GetInTouchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/products', function () {
    return Inertia::render('Products');
})->name('products');

Route::get('/products/{id}', function ($id) {
    return Inertia::render('ProductDetail', [
        'id' => (int) $id,
    ]);
})->name('product.detail');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/craftsmanship', function () {
    return Inertia::render('Craftsmanship');
})->name('craftsmanship');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout');

Route::get('/articles', function () {
    return Inertia::render('Articles');
})->name('articles');

Route::get('/articles/{id}', function ($id) {
    return Inertia::render('ArticleDetail', [
        'id' => (int) $id,
    ]);
})->name('article.detail');

Route::prefix('admin')->middleware(['auth', 'verified', 'checkAdmin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('articles', ArticleController::class);
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

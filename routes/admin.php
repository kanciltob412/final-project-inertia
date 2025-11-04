<?php

use Illuminate\Support\Facades\Route;

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
});

<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CarouselController;

Route::prefix('admin')->group(function () {

    Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');

    Route::get('/users/{namauser}', function ($namauser) {
        return 'Admin - User: ' . e($namauser);
    });

    // Newsletter admin routes
    Route::get('/newsletter', [NewsletterController::class, 'index'])->name('admin.newsletter.index');
    Route::delete('/newsletter/{id}', [NewsletterController::class, 'destroy'])->name('admin.newsletter.destroy');
    Route::post('/newsletter/bulk', [NewsletterController::class, 'bulkDelete'])->name('admin.newsletter.bulk');
    Route::get('/newsletter/export', [NewsletterController::class, 'export'])->name('admin.newsletter.export');

    // Carousel management routes
    Route::resource('carousels', CarouselController::class);

    // Order shipping routes
    Route::post('/orders/{id}/ship', [\App\Http\Controllers\OrderController::class, 'markAsShipped'])->name('admin.orders.ship');

    // Customer dashboards routes
    Route::delete('/customer-dashboards/bulk', [\App\Http\Controllers\Admin\CustomerDashboardsController::class, 'bulkDelete'])->name('admin.customer-dashboards.bulk-delete');
    Route::post('/customer-dashboards/{user}/reset-password', [\App\Http\Controllers\Admin\CustomerDashboardsController::class, 'resetPassword'])->name('admin.customer-dashboards.reset-password');
    Route::get('/customer-dashboards', [\App\Http\Controllers\Admin\CustomerDashboardsController::class, 'index'])->name('admin.customer-dashboards.index');
    Route::get('/customer-dashboards/{user}', [\App\Http\Controllers\Admin\CustomerDashboardsController::class, 'show'])->name('admin.customer-dashboards.show');

    // Dashboard content management routes
    Route::get('/dashboard-content', [\App\Http\Controllers\Admin\DashboardContentController::class, 'index'])->name('admin.dashboard-content.index');
    Route::post('/dashboard-content', [\App\Http\Controllers\Admin\DashboardContentController::class, 'store'])->name('admin.dashboard-content.store');
    Route::put('/dashboard-content/{dashboardContent}', [\App\Http\Controllers\Admin\DashboardContentController::class, 'update'])->name('admin.dashboard-content.update');
    Route::delete('/dashboard-content/{dashboardContent}', [\App\Http\Controllers\Admin\DashboardContentController::class, 'destroy'])->name('admin.dashboard-content.destroy');
});

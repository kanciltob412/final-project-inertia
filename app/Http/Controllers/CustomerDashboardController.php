<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\CustomerDashboardContent;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $dashboardData = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'stats' => [
                'totalOrders' => $user->orders()->count(),
                'totalWishlist' => $user->wishlists()->count(),
                'totalAddresses' => $user->addresses()->count(),
            ],
            'recentOrders' => $user->orders()
                ->with('items.product')
                ->latest()
                ->take(5)
                ->get()
                ->toArray(),
            'dashboardContent' => CustomerDashboardContent::where('is_active', true)
                ->where(function ($query) {
                    $query->whereNull('start_date')
                        ->orWhere('start_date', '<=', now());
                })
                ->where(function ($query) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', now());
                })
                ->orderBy('display_order')
                ->orderBy('created_at', 'desc')
                ->get()
                ->toArray(),
        ];

        return Inertia::render('Customer/Dashboard', $dashboardData);
    }
}

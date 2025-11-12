<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalCategories' => Category::count(),
            'totalArticles' => Article::count(),
            'totalOrders' => Order::count(),
            'totalUsers' => User::count(),
            'recentProducts' => Product::latest()->take(5)->with('category')->get(),
            'recentOrders' => Order::latest()->take(5)->with('user', 'items.product')->get(),
            'monthlyStats' => [
                'orders' => Order::whereMonth('created_at', Carbon::now()->month)->count(),
                'products' => Product::whereMonth('created_at', Carbon::now()->month)->count(),
                'articles' => Article::whereMonth('created_at', Carbon::now()->month)->count(),
            ]
        ];

        return Inertia::render('AdminDashboard', [
            'stats' => $stats
        ]);
    }
}
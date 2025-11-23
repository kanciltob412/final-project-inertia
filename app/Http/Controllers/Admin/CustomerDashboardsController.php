<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetByAdmin;

class CustomerDashboardsController extends Controller
{
    /**
     * Display a listing of customer dashboards.
     */
    public function index(): Response
    {
        // Get all customers (users where role is not ADMIN)
        $customers = User::where('role', '!=', 'ADMIN')
            ->with(['orders' => function ($query) {
                $query->latest()->limit(5);
            }, 'wishlists', 'addresses'])
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'created_at' => $customer->created_at,
                    'total_orders' => $customer->orders->count(),
                    'total_wishlist' => $customer->wishlists->count(),
                    'total_addresses' => $customer->addresses->count(),
                    'total_spent' => $customer->orders->sum('total') ?? 0,
                    'recent_order' => $customer->orders->first(),
                ];
            });

        return Inertia::render('Admin/CustomerDashboards', [
            'customers' => $customers,
        ]);
    }

    /**
     * Display a specific customer's dashboard.
     */
    public function show(User $user): Response
    {
        // Ensure the user is a customer, not an admin
        if ($user->role === 'ADMIN') {
            abort(403);
        }

        $user->load(['orders', 'wishlists', 'addresses']);

        $stats = [
            'totalOrders' => $user->orders->count(),
            'totalWishlist' => $user->wishlists->count(),
            'totalAddresses' => $user->addresses->count(),
            'totalSpent' => $user->orders->sum('total') ?? 0,
        ];

        $recentOrders = $user->orders()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total' => $order->total,
                    'items' => $order->items,
                ];
            });

        return Inertia::render('Admin/CustomerDashboardShow', [
            'customer' => $user,
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }

    /**
     * Delete multiple customers at once.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        // Only delete non-admin users
        $count = User::whereIn('id', $validated['ids'])
            ->where('role', '!=', 'ADMIN')
            ->delete();

        return redirect('/admin/customer-dashboards')->with('success', "$count customer(s) deleted successfully");
    }

    /**
     * Reset customer password by admin.
     */
    public function resetPassword(Request $request, User $user)
    {
        // Ensure the user is a customer, not an admin
        if ($user->role === 'ADMIN') {
            abort(403, 'Cannot reset admin password');
        }

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Update the password
        $user->password = Hash::make($validated['password']);
        $user->save();

        // Send email notification to the customer
        Mail::to($user->email)->send(new PasswordResetByAdmin($user));

        return redirect()->back()->with('success', 'Password reset successfully. Email notification sent to customer.');
    }
}

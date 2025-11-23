<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WishlistsController extends Controller
{
    /**
     * Display a listing of the user's wishlist items.
     */
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $wishlists = $user->wishlists()
            ->with('product')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Customer/Wishlists', [
            'wishlists' => $wishlists,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();

        // Check if already in wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Product already in wishlist'], 409);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Added to wishlist']);
    }

    /**
     * Remove product from wishlist
     */
    public function destroy($productId)
    {
        $user = Auth::user();

        Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }

    /**
     * Get user's wishlist
     */
    public function index()
    {
        $user = Auth::user();

        $wishlist = Wishlist::where('user_id', $user->id)
            ->with(['product.images', 'product.category'])
            ->latest()
            ->get();

        return response()->json($wishlist);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check($productId)
    {
        $user = Auth::user();

        $inWishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['inWishlist' => $inWishlist]);
    }
}

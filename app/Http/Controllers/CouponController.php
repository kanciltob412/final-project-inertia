<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::latest()->get();
        return Inertia::render('Coupon/Index', ['coupons' => $coupons]);
    }

    public function create()
    {
        return Inertia::render('Coupon/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:coupons,code',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'expiry_date' => 'nullable|date_format:Y-m-d H:i',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        // Ensure is_active defaults to true if not provided
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['used_count'] = 0;

        Coupon::create($validated);
        return redirect('/admin/coupons')->with('success', 'Coupon created successfully');
    }

    public function edit(Coupon $coupon)
    {
        return Inertia::render('Coupon/Edit', ['coupon' => $coupon]);
    }

    public function show(Coupon $coupon)
    {
        return Inertia::render('Coupon/Edit', ['coupon' => $coupon]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:coupons,code,' . $coupon->id,
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'expiry_date' => 'nullable|date_format:Y-m-d H:i',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        // Ensure is_active defaults to true if not provided
        $validated['is_active'] = $validated['is_active'] ?? true;

        $coupon->update($validated);
        return redirect('/admin/coupons')->with('success', 'Coupon updated successfully');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return redirect('/admin/coupons')->with('success', 'Coupon deleted successfully');
    }

    public function validate(Request $request)
    {
        $code = $request->input('code');
        $subtotal = $request->input('subtotal', 0);

        $coupon = Coupon::where('code', $code)
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return response()->json(['success' => false, 'message' => 'Coupon not found'], 404);
        }

        if ($coupon->expiry_date && $coupon->expiry_date < now()) {
            return response()->json(['success' => false, 'message' => 'Coupon has expired'], 400);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json(['success' => false, 'message' => 'Coupon usage limit reached'], 400);
        }

        $discount = 0;
        if ($coupon->discount_type === 'percentage') {
            $discount = ($subtotal * $coupon->discount_value) / 100;
        } else {
            $discount = $coupon->discount_value;
        }

        return response()->json([
            'success' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
            ],
            'discount' => min($discount, $subtotal)
        ]);
    }
}

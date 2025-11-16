<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::latest()->paginate(15);

        return Inertia::render('Coupon/Index', [
            'coupons' => $coupons,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Coupon/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code', 'min:3', 'max:50'],
            'discount_type' => ['required', 'in:fixed,percentage'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'expiry_date' => ['nullable', 'date', 'after:today'],
            'is_active' => ['boolean'],
        ]);

        Coupon::create($validated);

        return redirect()->route('coupons.index')
            ->with('success', 'Coupon created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coupon $coupon)
    {
        return Inertia::render('Coupon/Edit', [
            'coupon' => $coupon,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code,' . $coupon->id, 'min:3', 'max:50'],
            'discount_type' => ['required', 'in:fixed,percentage'],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'expiry_date' => ['nullable', 'date', 'after:today'],
            'is_active' => ['boolean'],
        ]);

        $coupon->update($validated);

        return redirect()->route('coupons.index')
            ->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('coupons.index')
            ->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Validate coupon for checkout
     */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Coupon not found.',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => $coupon->getValidationError(),
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'coupon' => $coupon,
        ]);
    }
}

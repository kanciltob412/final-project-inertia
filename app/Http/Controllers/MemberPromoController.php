<?php

namespace App\Http\Controllers;

use App\Models\MemberPromo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberPromoController extends Controller
{
    public function index()
    {
        $promos = MemberPromo::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Customer/MemberPromo', [
            'promos' => $promos,
        ]);
    }
}

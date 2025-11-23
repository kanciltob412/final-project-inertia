<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(): Response
    {
        $orders = Auth::user()->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Customer/Orders', [
            'orders' => $orders,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GetInTouchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('GetInTouch');
    }
}

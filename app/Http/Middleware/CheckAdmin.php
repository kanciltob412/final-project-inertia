<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log for debugging
        Log::info('CheckAdmin middleware', [
            'has_user' => (bool)$request->user(),
            'user_id' => $request->user()?->id,
            'role' => $request->user()?->role,
            'path' => $request->path()
        ]);

        if (!$request->user() || $request->user()->role !== 'ADMIN') {
            Log::warning('CheckAdmin: Access denied', [
                'has_user' => (bool)$request->user(),
                'role' => $request->user()?->role
            ]);

            if ($request->user()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return redirect()->route('login')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}

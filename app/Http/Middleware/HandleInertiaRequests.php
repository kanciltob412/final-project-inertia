<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $userOrders = null;
        $wishlistCount = 0;
        // Use Auth::user() directly instead of $request->user() to get the latest auth state
        // This ensures Auth::login() changes in the controller are reflected
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user !== null) {
            $userOrders = $user->orders()->latest()->take(5)->get(['id', 'total', 'status', 'created_at']);
            $wishlistCount = $user->wishlists()->count();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'userOrders' => $userOrders,
            'wishlistCount' => $wishlistCount,
            'csrf_token' => csrf_token(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}

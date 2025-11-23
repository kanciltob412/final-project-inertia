<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to the social provider authentication page
     */
    public function redirectToProvider(string $provider)
    {
        $allowedProviders = ['google', 'facebook', 'github'];

        if (!in_array($provider, $allowedProviders)) {
            return redirect()->route('login')->with('error', 'Invalid provider');
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the social provider
     */
    public function handleProviderCallback(string $provider)
    {
        try {
            $allowedProviders = ['google', 'facebook', 'github'];

            if (!in_array($provider, $allowedProviders)) {
                return redirect()->route('login')->with('error', 'Invalid provider');
            }

            $socialUser = Socialite::driver($provider)->user();

            // Find or create user
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                // Update provider info if user exists
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'password' => Hash::make(Str::random(24)), // Random password for social users
                    'email_verified_at' => now(), // Auto-verify email for social login
                    'role' => 'customer', // Default role
                ]);
            }

            // Log the user in
            Auth::login($user, true);

            // Redirect based on role
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('customer.dashboard');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Authentication failed. Please try again.');
        }
    }
}

<?php

namespace App\Providers;

use App\Listeners\SendUserRegistrationNotification;
use App\Models\Order;
use App\Observers\OrderObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register event listeners
        Event::listen(
            Registered::class,
            SendUserRegistrationNotification::class,
        );

        // Register model observers
        // Order::observe(OrderObserver::class);
        // \App\Models\NewsletterSubscription::observe(\App\Observers\NewsletterSubscriptionObserver::class);
    }
}

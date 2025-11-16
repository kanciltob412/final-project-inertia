<?php

namespace App\Listeners;

use App\Mail\NewUserRegistrationNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendUserRegistrationNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        // Send notification to admin about new user registration
        Mail::to(config('mail.admin_email', 'admin@lavanyaceramics.com'))
            ->send(new NewUserRegistrationNotification($event->user));
    }
}

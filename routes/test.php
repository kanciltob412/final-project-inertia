<?php

use Illuminate\Support\Facades\Route;
use App\Models\NewsletterSubscription;
use App\Mail\WelcomeNewsletterSubscriber;
use App\Mail\AdminNewsletterNotification;

Route::get('/test-newsletter-email', function () {
    // Create a test subscription
    $subscription = new NewsletterSubscription();
    $subscription->email = 'test@example.com';
    $subscription->created_at = now();
    
    // Test welcome email template
    $welcomeMail = new WelcomeNewsletterSubscriber($subscription);
    
    // Test admin notification template
    $adminMail = new AdminNewsletterNotification($subscription);
    
    return view('emails.newsletter.welcome', compact('subscription'));
});

Route::get('/test-admin-email', function () {
    // Create a test subscription
    $subscription = new NewsletterSubscription();
    $subscription->email = 'test@example.com';
    $subscription->created_at = now();
    
    return view('emails.newsletter.admin-notification', compact('subscription'));
});
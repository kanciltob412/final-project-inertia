<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\NewsletterSubscription;
use App\Mail\WelcomeNewsletterSubscriber;
use App\Mail\AdminNewsletterNotification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class TestNewsletterEmails extends Command
{
    protected $signature = 'newsletter:test-emails {email=test@example.com}';
    protected $description = 'Test newsletter subscription emails';

    public function handle()
    {
        $testEmail = $this->argument('email');

        $this->info("Testing newsletter emails for: {$testEmail}");

        try {
            // Find existing or create a test subscription
            $subscription = NewsletterSubscription::where('email', $testEmail)->first();

            if (!$subscription) {
                $subscription = new NewsletterSubscription();
                $subscription->email = $testEmail;
                $subscription->is_active = true;
                $subscription->save();
                $this->info("✓ New newsletter subscription created with ID: {$subscription->id}");
            } else {
                $this->info("✓ Using existing newsletter subscription with ID: {$subscription->id}");
            }


            // Send welcome email to subscriber
            Mail::to($subscription->email)->send(new WelcomeNewsletterSubscriber($subscription));
            $this->info("✓ Welcome email sent to subscriber: {$subscription->email}");

            // Add delay to avoid rate limits
            sleep(2);

            // Get admin users
            $adminUsers = User::where('role', 'admin')->get();

            if ($adminUsers->count() > 0) {
                foreach ($adminUsers as $admin) {
                    Mail::to($admin->email)->send(new AdminNewsletterNotification($subscription));
                    $this->info("✓ Admin notification sent to: {$admin->email}");
                    sleep(1); // Delay between admin emails
                }
            } else {
                // Fallback to config admin email
                $adminEmail = config('mail.admin_email', 'info@lavanyaceramics.com');
                Mail::to($adminEmail)->send(new AdminNewsletterNotification($subscription));
                $this->info("✓ Admin notification sent to fallback email: {$adminEmail}");
            }

            $this->info("🎉 All newsletter emails sent successfully!");
        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}

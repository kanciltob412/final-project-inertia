<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use App\Models\User;
use App\Mail\WelcomeNewsletterSubscriber;
use App\Mail\AdminNewsletterNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    /**
     * Display a listing of newsletter subscriptions.
     */
    public function index()
    {
        $subscriptions = NewsletterSubscription::orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Newsletter', [
            'subscriptions' => $subscriptions,
        ]);
    }

    /**
     * Export newsletter subscriptions.
     */
    public function export()
    {
        $subscriptions = NewsletterSubscription::select('email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $csv = "Email,Subscribed At\n";
        foreach ($subscriptions as $subscription) {
            $csv .= $subscription->email . ',' . $subscription->created_at . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="newsletter_subscriptions.csv"');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NewsletterSubscription $subscription)
    {
        $subscription->delete();

        return redirect()->back()->with('success', 'Subscription deleted successfully.');
    }

    /**
     * Subscribe to newsletter.
     */
    public function subscribe(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:newsletter_subscriptions,email',
            ], [
                'email.required' => 'Email address is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already subscribed to our newsletter.',
            ]);

            $subscription = NewsletterSubscription::create([
                'email' => $request->email,
                'is_active' => true,
            ]);

            // Send welcome email to subscriber
            try {
                Mail::to($subscription->email)->send(new WelcomeNewsletterSubscriber($subscription));
                Log::info('Welcome email sent to newsletter subscriber: ' . $subscription->email);
            } catch (\Exception $e) {
                Log::error('Failed to send welcome email to newsletter subscriber: ' . $e->getMessage());
            }

            // Send notification email to admin(s)
            try {
                $adminEmails = User::where('role', 'ADMIN')->pluck('email')->toArray();
                
                // Also add a fallback admin email from config if no admin users found
                if (empty($adminEmails)) {
                    $adminEmails = [config('mail.admin_email', 'admin@lavanyaceramics.com')];
                }

                foreach ($adminEmails as $adminEmail) {
                    Mail::to($adminEmail)->send(new AdminNewsletterNotification($subscription));
                }
                
                Log::info('Admin notification emails sent for new newsletter subscription: ' . $subscription->email);
            } catch (\Exception $e) {
                Log::error('Failed to send admin notification email for newsletter subscription: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to newsletter!'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while subscribing. Please try again.'
            ], 500);
        }
    }

    /**
     * Bulk delete subscriptions.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:newsletter_subscriptions,id',
        ]);

        NewsletterSubscription::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Selected subscriptions deleted successfully.');
    }
}
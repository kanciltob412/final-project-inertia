<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;


class PaymentController extends Controller
{
    public function webhookPayment(Request $request)
    {
        $signature_header = $request->header('x-callback-token');
        $secret = env('XENDIT_WEBHOOK_TOKEN');

        if ($signature_header != $secret) {
            return response()->json([
                'data' => null,
                'message' => 'Unauthorized',
            ], 401);
        }

        $payload = $request->all();
        $order = Order::find($payload['external_id']);

        if (!$order) {
            return response()->json([
                'data' => null,
                'message' => 'Order not found',
            ], 404);
        }

        // Map payment status to our order status
        $status = match (strtolower($payload['status'])) {
            'paid', 'settled', 'completed' => 'paid',
            'expired', 'failed', 'cancelled' => 'cancelled',
            default => 'pending'
        };

        // Extract payment details from Xendit payload
        $paymentMethod = null;
        $paymentChannel = null;

        // Get raw payment details from various Xendit fields
        $rawMethod = $payload['payment_method'] ?? $payload['payment_method_id'] ?? null;
        $rawChannel = $payload['payment_channel'] ?? $payload['channel_code'] ?? $payload['ewallet_type'] ?? null;

        // Map payment methods to broad categories
        $methodMapping = [
            // E-Wallet methods
            'EWALLET' => 'EWALLET',
            'OVO' => 'EWALLET',
            'DANA' => 'EWALLET',
            'SHOPEEPAY' => 'EWALLET',
            'LINKAJA' => 'EWALLET',
            'GOPAY' => 'EWALLET',
            'JENIUS' => 'EWALLET',

            // Bank Transfer methods
            'BANK_TRANSFER' => 'BANK_TRANSFER',
            'VA' => 'BANK_TRANSFER',
            'VIRTUAL_ACCOUNT' => 'BANK_TRANSFER',
            'BCA' => 'BANK_TRANSFER',
            'BNI' => 'BANK_TRANSFER',
            'BRI' => 'BANK_TRANSFER',
            'MANDIRI' => 'BANK_TRANSFER',
            'PERMATA' => 'BANK_TRANSFER',

            // Credit/Debit Card methods
            'CARD' => 'CREDIT_CARD',
            'CREDIT_CARD' => 'CREDIT_CARD',
            'VISA' => 'CREDIT_CARD',
            'MASTERCARD' => 'CREDIT_CARD',

            // Other methods
            'QR_CODE' => 'QR_CODE',
            'RETAIL_OUTLET' => 'RETAIL_OUTLET',
        ];

        // Map payment channels to specific providers
        $channelMapping = [
            // E-Wallets
            'SHOPEEPAY' => 'SHOPEEPAY',
            'OVO' => 'OVO',
            'DANA' => 'DANA',
            'LINKAJA' => 'LINKAJA',
            'GOPAY' => 'GOPAY',
            'JENIUS' => 'JENIUS',

            // Banks
            'BCA' => 'BCA',
            'BNI' => 'BNI',
            'BRI' => 'BRI',
            'MANDIRI' => 'MANDIRI',
            'PERMATA' => 'PERMATA',
            'CIMB' => 'CIMB',
            'BSI' => 'BSI',

            // Cards
            'VISA' => 'VISA',
            'MASTERCARD' => 'MASTERCARD',
            'JCB' => 'JCB',
            'AMEX' => 'AMERICAN_EXPRESS',

            // Retail
            'ALFAMART' => 'ALFAMART',
            'INDOMARET' => 'INDOMARET',
        ];

        // Determine payment method category
        if ($rawMethod) {
            $upperRawMethod = strtoupper($rawMethod);
            $paymentMethod = $methodMapping[$upperRawMethod] ?? 'ONLINE_PAYMENT';
        }

        // Determine payment channel
        if ($rawChannel) {
            $upperRawChannel = strtoupper($rawChannel);
            $paymentChannel = $channelMapping[$upperRawChannel] ?? $upperRawChannel;
        }

        // Auto-detect method from channel if method is missing
        if (!$paymentMethod && $paymentChannel) {
            $ewallets = ['SHOPEEPAY', 'OVO', 'DANA', 'LINKAJA', 'GOPAY', 'JENIUS'];
            $banks = ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'CIMB', 'BSI'];
            $cards = ['VISA', 'MASTERCARD', 'JCB', 'AMERICAN_EXPRESS'];

            if (in_array($paymentChannel, $ewallets)) {
                $paymentMethod = 'EWALLET';
            } elseif (in_array($paymentChannel, $banks)) {
                $paymentMethod = 'BANK_TRANSFER';
            } elseif (in_array($paymentChannel, $cards)) {
                $paymentMethod = 'CREDIT_CARD';
            }
        }

        $order->update([
            'status'          => $status,
            'payment_channel' => $paymentChannel,
            'payment_method'  => $paymentMethod,
            'paid_at'         => $status === 'PAID' ? now() : null
        ]);

        // Send email notifications based on payment status
        try {
            $order = $order->load(['user', 'items.product']);

            if ($status === 'PAID') {
                // Send success emails
                \Illuminate\Support\Facades\Mail::to($order->user->email)->send(new \App\Mail\OrderConfirmationEmail($order));

                // Send admin notification
                $adminEmails = \App\Models\User::where('role', 'ADMIN')->pluck('email')->toArray();
                if (empty($adminEmails)) {
                    $adminEmails = [config('mail.admin_email', 'admin@lavanyaceramics.com')];
                }

                foreach ($adminEmails as $adminEmail) {
                    \Illuminate\Support\Facades\Mail::to($adminEmail)->send(new \App\Mail\AdminOrderNotification($order, 'success'));
                }

                Log::info('Payment success emails sent via webhook for order: ' . $order->id);
            } elseif (in_array($status, ['cancelled', 'expired', 'failed'])) {
                // Send failure emails
                \Illuminate\Support\Facades\Mail::to($order->user->email)->send(new \App\Mail\OrderFailedEmail($order));

                // Send admin notification
                $adminEmails = \App\Models\User::where('role', 'ADMIN')->pluck('email')->toArray();
                if (empty($adminEmails)) {
                    $adminEmails = [config('mail.admin_email', 'admin@lavanyaceramics.com')];
                }

                foreach ($adminEmails as $adminEmail) {
                    \Illuminate\Support\Facades\Mail::to($adminEmail)->send(new \App\Mail\AdminOrderNotification($order, 'failed'));
                }

                Log::info('Payment failure emails sent via webhook for order: ' . $order->id);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send webhook payment emails: ' . $e->getMessage());
        }

        // Log the payload for debugging (remove in production)
        Log::info('Payment webhook payload', [
            'original' => $payload,
            'extracted' => [
                'payment_method' => $paymentMethod,
                'payment_channel' => $paymentChannel,
                'status' => $status
            ],
            'available_fields' => array_keys($payload)
        ]);

        return response()->json([
            'data' => null,
            'message' => 'Order status updated'
        ], 200);
    }
}

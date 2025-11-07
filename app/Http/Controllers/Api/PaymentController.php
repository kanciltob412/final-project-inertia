<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;


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

        $order->update([
            'status'          => strtoupper($payload['status']),
            'payment_channel' => $payload['payment_channel'],
            'payment_method'  => $payload['payment_method']
        ]);

        return response()->json([
            'data' => null,
            'message' => 'Order status updated'
        ], 200);
    }
}

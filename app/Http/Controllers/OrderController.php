<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Coupon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderShippedNotification;
use Exception;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render("Order/index", [
            "data" => Order::with('user', 'items', 'items.product', 'coupon')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render("Order/form", [
            "users" => User::all(),
            "products" => Product::all()
        ]);
    }
    public function show($id)
    {
        $order = Order::with('user', 'items', 'items.product', 'coupon')->findOrFail($id);

        // Authorization check - allow if:
        // 1. User is admin (can view any order)
        // 2. User is authenticated and owns the order
        // 3. User is not authenticated (guest can view order immediately after payment)
        $user = Auth::user();
        if ($user && $user->role === 'ADMIN') {
            // Admin can view any order
        } elseif ($user && $user->id === $order->user_id) {
            // Customer can view their own order
        } elseif (!$user) {
            // Guest users can view orders (they just completed payment)
            // This allows guests to see their order immediately after payment completes
        } else {
            // Deny access only if authenticated user doesn't own the order
            abort(403, 'You do not have permission to view this order.');
        }

        return Inertia::render("Order/show", [
            "data" => $order
        ]);
    }
    public function edit($id)
    {
        $order = Order::with('user', 'items', 'items.product', 'coupon')->findOrFail($id);

        return Inertia::render("Order/form", [
            "order" => $order,
            "users" => User::all(),
            "products" => Product::all()
        ]);
    }
    public function update(Request $request, $id)
    {
        // Log incoming request for debugging
        Log::info("Order update request received", [
            'order_id' => $id,
            'request_data' => $request->all()
        ]);

        try {
            // Logic to update the order
            $order = Order::findOrFail($id);

            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'address' => 'required|string',
                'phone' => 'required|string',
                'city' => 'required|string',
                'country' => 'required|string',
                'postal_code' => 'required|string',
                'status' => 'required|in:PENDING,PAID,PROCESSING,SHIPPED,DELIVERED,CANCELLED',
                'total' => 'required|numeric',
                'payment_method' => 'nullable|string',
                'payment_channel' => 'nullable|string',
                'url' => 'nullable|url',
                'courier_name' => 'nullable|required_if:status,SHIPPED|string',
                'tracking_number' => 'nullable|required_if:status,SHIPPED|string',
                'items' => 'nullable|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            Log::info("Order validation passed", ['validated_data' => $validated]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Order validation failed", [
                'order_id' => $id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return back()->withErrors($e->errors())->withInput();
        }

        DB::beginTransaction();
        try {
            // Check if status is changing to shipped
            $wasShipped = $order->status === 'SHIPPED';
            $isBecomingShipped = $validated['status'] === 'SHIPPED' && !$wasShipped;

            // Check if status is changing to cancelled
            $wasCancelled = $order->status === 'CANCELLED';
            $isBecomingCancelled = $validated['status'] === 'CANCELLED' && !$wasCancelled;

            // Restore stock if order is being cancelled
            if ($isBecomingCancelled) {
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    if ($product) {
                        $product->increment('stock', $item->quantity);
                    }
                }
            }

            // Set shipped_at timestamp if becoming shipped
            if ($isBecomingShipped) {
                $validated['shipped_at'] = now();
            }

            // Update the order
            $order->update($validated);

            // Send shipping notification if status changed to shipped
            if ($isBecomingShipped) {
                try {
                    if ($order->user && $order->user->email) {
                        Mail::to($order->user->email)
                            ->send(new OrderShippedNotification($order->fresh()));

                        Log::info("Shipping notification sent for Order #{$order->id}");
                    }
                } catch (\Exception $mailException) {
                    Log::error("Failed to send shipping notification for Order #{$order->id}: " . $mailException->getMessage());
                    // Continue with order update even if email fails
                }
            }

            // Update order items if provided
            if (isset($validated['items'])) {
                // Restore stock for deleted items
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    if ($product) {
                        $product->increment('stock', $item->quantity);
                    }
                }

                // Delete existing items
                $order->items()->delete();

                // Create new items
                foreach ($validated['items'] as $itemData) {
                    $product = Product::find($itemData['product_id']);
                    if ($product) {
                        $product->decrement('stock', $itemData['quantity']);
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'price' => $itemData['price'],
                        'discount' => $itemData['discount'] ?? 0,
                        'discount_type' => $itemData['discount_type'] ?? 'fixed',
                    ]);
                }
            }

            DB::commit();

            Log::info("Order updated successfully", ['order_id' => $order->id]);

            return redirect()->route("orders.index")->with("success", "Order updated successfully.");
        } catch (\Exception $e) {
            DB::rollback();

            Log::error("Failed to update order", [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to update order: ' . $e->getMessage()]);
        }
    }
    public function destroy($id)
    {
        // Logic to delete the order
        $order = Order::findOrFail($id);

        // Restore stock for all order items before deleting
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        // Delete order...
        $order->delete();

        return redirect()->route("orders.index")->with("success", "Order deleted successfully.");
    }
    public function store(Request $request)
    {
        // Logic to store a new order
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'address' => 'required|string',
            'phone' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'total' => 'required|numeric',
        ]);
        // This is a placeholder implementation
        $order = Order::create($validated);
        // Store order...

        return redirect()->route("orders.index")->with("success", "Order created successfully.");
    }

    /**
     * Process payment and create an order.
     */
    public function payOrder(Request $request)
    {
        Log::info('PayOrder method called', $request->all());

        // Make email required only for guest users
        $emailRequired = !Auth::check();

        $request->validate([
            'full_name' => ['required', 'string'],
            'email' => $emailRequired ? ['required', 'email'] : ['nullable', 'email'],
            'password' => ['required_if:create_account,true', 'string', 'min:8'],
            'create_account' => ['boolean'],
            'address' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'city' => ['required', 'string'],
            'country' => ['required', 'string'],
            'postal_code' => ['required', 'string'],
            'shipping_cost' => ['required', 'numeric', 'min:0'],
            'shipping_courier' => ['required', 'string'],
            'shipping_service' => ['required', 'string'],
            'destination_city_id' => ['required', 'integer'],
            'coupon_id' => ['nullable', 'integer', 'exists:coupons,id'],
            'coupon_discount' => ['nullable', 'numeric', 'min:0'],
            'products' => ['required', 'array'],
            'products.*.id' => ['required', 'exists:products,id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        DB::beginTransaction();

        try {
            // Handle user - either authenticated user or create/login guest user
            $user = Auth::user();
            if (!$user) {
                // Check if user exists with this email
                $user = User::where('email', $request->email)->first();

                if (!$user) {
                    // Create new user with proper password if they want to create account
                    if ($request->create_account && $request->password) {
                        $user = User::create([
                            'name' => $request->full_name,
                            'email' => $request->email,
                            'password' => Hash::make($request->password),
                            'email_verified_at' => now(),
                        ]);
                    } else {
                        // For guest checkout without account, create user but don't authenticate yet
                        // They will be authenticated after payment
                        $user = User::create([
                            'name' => $request->full_name,
                            'email' => $request->email,
                            'password' => Hash::make(uniqid() . time()),
                            'email_verified_at' => now(),
                        ]);
                    }
                }

                // Authenticate the user only if they explicitly want to create an account
                if ($request->create_account && $request->password) {
                    Auth::login($user, remember: false);
                }
            }

            $order = Order::create([
                'user_id' => $user->id,
                'address' => $request->address,
                'phone' => $request->phone,
                'city' => $request->city,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'shipping_courier' => $request->shipping_courier,
                'shipping_service' => $request->shipping_service,
                'shipping_cost' => (int) $request->shipping_cost,
                'destination_city_id' => (int) $request->destination_city_id,
                'coupon_id' => $request->coupon_id ? (int) $request->coupon_id : null,
                'coupon_discount' => $request->coupon_discount ? (float) $request->coupon_discount : 0,
            ]);

            $total = 0;

            if (is_array($request->products)) {
                foreach ($request->products as $productData) {
                    $product = Product::find($productData['id']);

                    // Check if product exists
                    if (!$product) {
                        throw new Exception("Product with ID {$productData['id']} not found.");
                    }

                    // Check if product has enough stock
                    if ($product->stock < $productData['quantity']) {
                        throw new Exception("Product '{$product->name}' is out of stock.");
                    }

                    // Decrement product stock
                    $product->decrement('stock', $productData['quantity']);

                    // Calculate price after product discount
                    $discountAmount = 0;
                    $finalPrice = $product->price;

                    if ($product->discount && $product->discount > 0) {
                        if ($product->discount_type === 'percentage') {
                            $discountAmount = $product->price * ($product->discount / 100);
                        } else {
                            $discountAmount = $product->discount;
                        }
                        $finalPrice = $product->price - $discountAmount;
                    }

                    $lineTotal = $finalPrice * $productData['quantity'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $productData['quantity'],
                        'price' => $finalPrice,
                        'discount' => $discountAmount,
                        'discount_type' => $product->discount_type,
                    ]);

                    $total += $lineTotal;
                }
            }

            // Add shipping cost to total
            $total += (int) $request->shipping_cost;

            // Subtract discount if applied
            if ($request->coupon_discount) {
                $total -= (float) $request->coupon_discount;
                // Increment coupon usage count
                if ($request->coupon_id) {
                    Coupon::find($request->coupon_id)?->increment('used_count');
                }
            }

            $order->update(['total' => $total]);

            // Reuse existing invoice if available
            if ($order->url) {
                DB::commit();
                return Inertia::render('PaymentRedirect', [
                    'payment_url' => $order->url
                ]);
            }

            $apiKey = env('XENDIT_API_KEY');
            // Try different approaches - start with unrestricted
            $payload = [
                'external_id'      => (string) $order->id,
                'description'      => "Invoice for order {$order->id}",
                'amount'           => $order->total,
                'invoice_duration' => 172800, // 2 days
                'currency'         => 'IDR',
                'reminder_time'    => 1,
                'success_redirect_url' => url('/payment-success?order_id=' . $order->id),
                'failure_redirect_url' => url('/payment-failed?order_id=' . $order->id),
                'should_send_email' => false,
                // Ensure webhook contains payment details
                'metadata' => [
                    'order_id' => $order->id,
                    'request_payment_details' => true
                ]
            ];

            // Alternative: Try with explicit payment methods if needed
            // Uncomment this section if you want to explicitly enable specific methods
            /*
            $payload['payment_methods'] = [
                'CREDIT_CARD',
                'BANK_TRANSFER', 
                'EWALLET',
                'RETAIL_OUTLET',
                'QR_CODE'
            ];
            */

            // Log the payload for debugging
            Log::info('Xendit Invoice Payload', $payload);
            Log::info('Xendit API Key prefix', ['key_prefix' => substr($apiKey, 0, 8)]);

            // Direct CURL usage for full control over API behavior
            $ch = curl_init();
            $response = null;
            $httpCode = null;

            try {
                curl_setopt($ch, CURLOPT_URL, 'https://api.xendit.co/v2/invoices');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Content-Type: application/json',
                    'Authorization: Basic ' . base64_encode($apiKey . ':'),
                ]);

                $response = curl_exec($ch);
                if (curl_errno($ch)) {
                    throw new Exception('Curl error: ' . curl_error($ch));
                }

                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            } finally {
                if (is_resource($ch)) {
                    curl_close($ch); // @phpstan-ignore-line - needed for resource cleanup
                }
            }

            // Log the response for debugging
            Log::info('Xendit API Response', [
                'http_code' => $httpCode,
                'response' => $response
            ]);

            if (!in_array($httpCode, [200, 201])) {
                $errorResponse = json_decode($response, true);
                $message = $errorResponse['message'] ?? 'Failed to create invoice';
                Log::error('Xendit Invoice Creation Failed', [
                    'http_code' => $httpCode,
                    'error_response' => $errorResponse,
                    'message' => $message
                ]);
                throw new Exception($message);
            }

            $result = json_decode($response, true);
            Log::info('Xendit Invoice Created Successfully', $result);

            $order->update(['url' => $result['invoice_url']]);

            DB::commit();

            Log::info('About to redirect to payment URL', ['url' => $result['invoice_url']]);
            // Return Inertia response with payment URL as a prop
            // The frontend component will handle the redirect
            return Inertia::render('PaymentRedirect', [
                'payment_url' => $result['invoice_url']
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('PayOrder exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            // Return JSON error for Inertia requests
            if (request()->expectsJson() || request()->header('X-Inertia')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => true
                ], 422);
            }

            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }

    /**
     * Bulk update order status or delete orders.
     */
    public function bulkUpdate(Request $request)
    {
        try {
            Log::info('Bulk update request received', $request->all());

            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:order,id',
                'status' => 'nullable|in:pending,paid,cancelled'
            ]);

            Log::info('Validation passed', $validated);

            if (isset($validated['status'])) {
                // Update status individually to trigger Observer for email notifications
                $orders = Order::whereIn('id', $validated['ids'])->get();
                $affectedRows = 0;

                foreach ($orders as $order) {
                    $order->update(['status' => $validated['status']]);
                    $affectedRows++;
                }

                Log::info("Updated {$affectedRows} orders to status {$validated['status']}");

                $message = "Orders status updated to {$validated['status']} successfully. Email notifications sent.";
            } else {
                // Delete orders individually (no emails sent as per Observer design)
                $orders = Order::whereIn('id', $validated['ids'])->get();
                $deletedCount = 0;

                foreach ($orders as $order) {
                    $order->delete(); // Goes through Observer but no emails sent
                    $deletedCount++;
                }

                $message = "Orders deleted successfully. ({$deletedCount} orders)";
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Bulk update failed', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return back()->with('error', 'Failed to update orders: ' . $e->getMessage());
        }
    }

    /**
     * Duplicate an order.
     */
    public function duplicate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:order,id',
        ]);

        DB::beginTransaction();

        try {
            $originalOrder = Order::with('items')->findOrFail($validated['id']);

            // Create new order
            $newOrder = Order::create([
                'user_id' => $originalOrder->user_id,
                'address' => $originalOrder->address,
                'phone' => $originalOrder->phone,
                'city' => $originalOrder->city,
                'country' => $originalOrder->country,
                'postal_code' => $originalOrder->postal_code,
                'status' => 'PENDING', // Set as pending by default
                'total' => $originalOrder->total,
            ]);

            // Duplicate order items
            foreach ($originalOrder->items as $item) {
                OrderItem::create([
                    'order_id' => $newOrder->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'discount' => $item->discount,
                    'discount_type' => $item->discount_type,
                ]);
            }

            DB::commit();

            return back()->with('success', 'Order duplicated successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to duplicate order: ' . $e->getMessage());
        }
    }

    /**
     * Handle payment success callback
     */
    public function paymentSuccess(Request $request)
    {
        $orderId = $request->get('order_id');

        if ($orderId) {
            $order = Order::with(['user', 'items.product'])->find($orderId);
            if ($order) {
                // Update order status to paid only if it's not already paid
                if ($order->status !== 'PAID') {
                    $order->update(['status' => 'PAID']);
                    Log::info('Order marked as paid', ['order_id' => $order->id]);
                }

                // Always authenticate the user after payment
                // This ensures both registered and guest users are logged in after payment
                if ($order->user && !Auth::check()) {
                    Auth::login($order->user, remember: false);
                    Log::info('User authenticated after payment', ['user_id' => $order->user->id, 'order_id' => $order->id]);
                }

                // Send confirmation email to customer
                try {
                    Mail::to($order->user->email)->send(new \App\Mail\OrderConfirmationEmail($order));
                    Log::info('Order confirmation email sent to customer: ' . $order->user->email);
                } catch (\Exception $e) {
                    Log::error('Failed to send order confirmation email: ' . $e->getMessage());
                }

                // Send notification email to admin(s)
                try {
                    $adminEmails = \App\Models\User::where('role', 'ADMIN')->pluck('email')->toArray();

                    if (empty($adminEmails)) {
                        $adminEmails = [config('mail.admin_email', 'admin@lavanyaceramics.com')];
                    }

                    foreach ($adminEmails as $adminEmail) {
                        Mail::to($adminEmail)->send(new \App\Mail\AdminOrderNotification($order, 'success'));
                    }

                    Log::info('Admin order notification emails sent for successful order: ' . $order->id);
                } catch (\Exception $e) {
                    Log::error('Failed to send admin order notification email: ' . $e->getMessage());
                }
            }
        }

        return Inertia::render('PaymentSuccess', [
            'order_id' => $orderId,
            'is_authenticated' => Auth::check(),
            'user' => Auth::user(),
        ]);
    }

    /**
     * Handle payment failure callback
     */
    public function paymentFailed(Request $request)
    {
        $orderId = $request->get('order_id');

        if ($orderId) {
            $order = Order::with(['user', 'items.product'])->find($orderId);
            if ($order) {
                // Send failed payment email to customer
                try {
                    Mail::to($order->user->email)->send(new \App\Mail\OrderFailedEmail($order));
                    Log::info('Order failed email sent to customer: ' . $order->user->email);
                } catch (\Exception $e) {
                    Log::error('Failed to send order failed email: ' . $e->getMessage());
                }

                // Send notification email to admin(s) about failed payment
                try {
                    $adminEmails = \App\Models\User::where('role', 'ADMIN')->pluck('email')->toArray();

                    if (empty($adminEmails)) {
                        $adminEmails = [config('mail.admin_email', 'admin@lavanyaceramics.com')];
                    }

                    foreach ($adminEmails as $adminEmail) {
                        Mail::to($adminEmail)->send(new \App\Mail\AdminOrderNotification($order, 'failed'));
                    }

                    Log::info('Admin order notification emails sent for failed order: ' . $order->id);
                } catch (\Exception $e) {
                    Log::error('Failed to send admin order failed notification email: ' . $e->getMessage());
                }
            }
        }

        return Inertia::render('PaymentFailed', [
            'order_id' => $orderId
        ]);
    }

    /**
     * Handle guest user registration or existing user login for checkout
     */
    private function handleGuestUser(Request $request)
    {
        // If user is already authenticated, use current user
        if (Auth::check()) {
            return Auth::user();
        }

        $email = $request->email;
        $existingUser = User::where('email', $email)->first();

        if ($existingUser) {
            // User already exists, use existing account
            return $existingUser;
        }

        if ($request->create_account) {
            // Create new user account
            $user = User::create([
                'name' => $request->full_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(), // Auto-verify for guest checkout
            ]);

            // Optionally log them in
            Auth::login($user);

            return $user;
        } else {
            // Create temporary guest user (you might want to handle this differently)
            // For now, create user without password for guest orders
            $user = User::create([
                'name' => $request->full_name,
                'email' => $request->email,
                'password' => Hash::make(uniqid()), // Random password for guest
                'email_verified_at' => now(),
            ]);

            return $user;
        }
    }

    /**
     * Mark an order as shipped with courier and tracking information.
     */
    public function markAsShipped(Request $request, $id)
    {
        try {
            $order = Order::with('user', 'items', 'items.product')->findOrFail($id);

            $validated = $request->validate([
                'courier_name' => 'required|string|max:255',
                'tracking_number' => 'required|string|max:255',
            ]);

            // Update order with shipping information
            $order->update([
                'status' => 'SHIPPED',
                'courier_name' => $validated['courier_name'],
                'tracking_number' => $validated['tracking_number'],
                'shipped_at' => now(),
            ]);

            // Send email notification to customer
            try {
                if ($order->user && $order->user->email) {
                    Mail::to($order->user->email)
                        ->send(new OrderShippedNotification($order));

                    Log::info("Shipping notification sent", [
                        'order_id' => $order->id,
                        'customer_email' => $order->user->email,
                        'courier' => $validated['courier_name'],
                        'tracking' => $validated['tracking_number']
                    ]);
                }
            } catch (Exception $mailException) {
                Log::error("Failed to send shipping notification email", [
                    'order_id' => $order->id,
                    'error' => $mailException->getMessage()
                ]);
                // Continue execution even if email fails
            }

            return back()->with('success', "Order #{$order->id} marked as shipped successfully. Customer notification sent.");
        } catch (Exception $e) {
            Log::error("Failed to mark order as shipped", [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return back()->with('error', 'Failed to mark order as shipped: ' . $e->getMessage());
        }
    }
}

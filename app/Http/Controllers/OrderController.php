<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Exception;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render("Order/index", [
            "data" => Order::with('user', 'items', 'items.product', 'items.productVariant')->get()
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
        $order = Order::with('user', 'items', 'items.product', 'items.productVariant')->findOrFail($id);

        return Inertia::render("Order/show", [
            "data" => $order
        ]);
    }
    public function edit($id)
    {
        $order = Order::with('user', 'items', 'items.product', 'items.productVariant')->findOrFail($id);

        return Inertia::render("Order/form", [
            "order" => $order,
            "users" => User::all(),
            "products" => Product::all()
        ]);
    }
    public function update(Request $request, $id)
    {
        // Logic to update the order
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'address' => 'required|string',
            'phone' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'status' => 'required|in:pending,paid,cancelled',
            'total' => 'required|numeric',
            'payment_method' => 'nullable|string',
            'payment_channel' => 'nullable|string',
            'url' => 'nullable|url',
            'items' => 'nullable|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Update the order
            $order->update($validated);

            // Update order items if provided
            if (isset($validated['items'])) {
                // Delete existing items
                $order->items()->delete();
                
                // Create new items
                foreach ($validated['items'] as $itemData) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'price' => $itemData['price'],
                    ]);
                }
            }

            DB::commit();
            return redirect()->route("orders.index")->with("success", "Order updated successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update order: ' . $e->getMessage()]);
        }
    }
    public function destroy($id)
    {
        // Logic to delete the order
        $order = Order::findOrFail($id);
        // This is a placeholder implementation
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
            'products.*.id' => ['required', 'exists:products,id'],
            'products.*.variant_id' => ['nullable', 'exists:product_variants,id'],
            'products.*.color' => ['nullable', 'string'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        DB::beginTransaction();

        try {
            // Handle user - either authenticated user or create guest user
            $user = Auth::user();
            if (!$user) {
                // Create or find guest user by email
                $user = User::firstOrCreate(
                    ['email' => $request->email],
                    [
                        'name' => $request->full_name,
                        'email' => $request->email,
                        'password' => Hash::make('guest_password_' . time()),
                    ]
                );
            }

            $order = Order::create([
                'user_id' => $user->id,
                'address' => $request->address,
                'phone' => $request->phone,
                'city' => $request->city,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
            ]);

            $total = 0;

            foreach ($request->products as $productData) {
                $product = Product::find($productData['id']);
                
                // Handle variant-based or legacy product ordering
                if (isset($productData['variant_id']) && $productData['variant_id']) {
                    // New variant-based ordering
                    $variant = ProductVariant::find($productData['variant_id']);
                    if (!$variant || $variant->stock < $productData['quantity']) {
                        throw new Exception("Product variant is out of stock.");
                    }
                    
                    // Decrement variant stock
                    $variant->decrement('stock', $productData['quantity']);
                    
                    $price = $product->price * $productData['quantity'];
                    
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_variant_id' => $variant->id,
                        'quantity' => $productData['quantity'],
                        'price' => $price,
                    ]);
                } else {
                    // Legacy ordering (for backward compatibility)
                    $totalProductStock = $product->variants()->sum('stock');
                    if ($totalProductStock < $productData['quantity']) {
                        throw new Exception("Product with ID {$product->id} is out of stock.");
                    }
                    
                    // Decrement from first available variant
                    $availableVariant = $product->variants()->where('stock', '>', 0)->first();
                    if ($availableVariant) {
                        $availableVariant->decrement('stock', $productData['quantity']);
                    }
                    
                    $price = $product->price * $productData['quantity'];
                    
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_variant_id' => $availableVariant?->id,
                        'quantity' => $productData['quantity'],
                        'price' => $price,
                    ]);
                }
                
                $total += $price;
            }
            $order->update(['total' => $total]);

            // Reuse existing invoice if available
            if ($order->url) {
                DB::commit();
                return Inertia::location($order->url);
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
            curl_close($ch);

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
            return Inertia::location($result['invoice_url']);
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
                'status' => 'pending', // Set as pending by default
                'total' => $originalOrder->total,
            ]);

            // Duplicate order items
            foreach ($originalOrder->items as $item) {
                OrderItem::create([
                    'order_id' => $newOrder->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
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
            $order = Order::find($orderId);
            if ($order) {
                // Update order status to paid
                $order->update(['status' => 'PAID']);
            }
        }

        return Inertia::render('PaymentSuccess', [
            'order_id' => $orderId
        ]);
    }

    /**
     * Handle payment failure callback
     */
    public function paymentFailed(Request $request)
    {
        $orderId = $request->get('order_id');

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
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render("Order/index", [
            "data" => Order::with('user', 'items', 'items.product')->get() // Placeholder for actual order data retrieval
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
        $order = Order::with('user', 'items', 'items.product')->findOrFail($id);

        return Inertia::render("Order/show", [
            "data" => $order
        ]);
    }
    public function edit($id)
    {
        $order = Order::with('user', 'items', 'items.product')->findOrFail($id);

        return Inertia::render("Order/form", [
            "order" => $order,
            "users" => User::all()
        ]);
    }
    public function update(Request $request, $id)
    {
        // Logic to update the order
        $order = Order::findOrFail($id);
        // This is a placeholder implementation
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'address' => 'required|string',
            'phone' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'postal_code' => 'required|string',
            'status' => 'required|string',
            'total' => 'required|numeric',
        ]);
        $order->update($validated);

        return redirect()->route("orders.index")->with("success", "Order updated successfully.");
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
        $request->validate([
            'address' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'city' => ['required', 'string'],
            'country' => ['required', 'string'],
            'postal_code' => ['required', 'string'],
            'products.*.id' => ['required', 'exists:products,id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'address' => $request->address,
                'phone' => $request->phone,
                'city' => $request->city,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
            ]);

            $total = 0;

            foreach ($request->products as $productData) {
                $product = Product::find($productData['id']);
                if ($product->stock < $productData['quantity']) {
                    throw new Exception("Product product with ID {$product->id} is out of stock.");
                }

                $product->decrement('stock', $productData['quantity']);

                $price = $product->price * $productData['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $productData['quantity'],
                    'price' => $price,
                ]);

                $total += $price;
            }
            $order->update(['total' => $total]);

            // Reuse existing invoice if available
            if ($order->url) {
                DB::commit();
                return Inertia::location($order->url);
            }

            $apiKey = env('XENDIT_API_KEY');
            $payload = [
                'external_id'      => (string) $order->id,
                'description'      => "Invoice for order {$order->id}",
                'amount'           => $order->total,
                'invoice_duration' => 172800, // 2 days
                'currency'         => 'IDR',
                'reminder_time'    => 1,
            ];

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

            if (!in_array($httpCode, [200, 201])) {
                $errorResponse = json_decode($response, true);
                $message = $errorResponse['message'] ?? 'Failed to create invoice';
                throw new Exception($message);
            }

            $result = json_decode($response, true);

            $order->update(['url' => $result['invoice_url']]);

            DB::commit();

            return Inertia::location($result['invoice_url']);
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Bulk update order status or delete orders.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:order,id',
            'status' => 'nullable|in:pending,processing,completed,cancelled'
        ]);

        if (isset($validated['status'])) {
            // Update status
            Order::whereIn('id', $validated['ids'])
                ->update(['status' => $validated['status']]);

            $message = "Orders status updated to {$validated['status']} successfully.";
        } else {
            // Delete orders (if no status provided, assume delete operation)
            Order::whereIn('id', $validated['ids'])->delete();
            $message = 'Orders deleted successfully.';
        }

        return back()->with('success', $message);
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
}

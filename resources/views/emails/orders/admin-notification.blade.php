<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order {{ $type === 'success' ? 'Successful' : 'Failed' }} - Admin Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid {{ $type === 'success' ? '#28a745' : '#dc3545' }};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            color: #2c1810;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .status-badge {
            background-color: {{ $type === 'success' ? '#d4edda' : '#f8d7da' }};
            color: {{ $type === 'success' ? '#155724' : '#721c24' }};
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .title {
            color: {{ $type === 'success' ? '#28a745' : '#dc3545' }};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid {{ $type === 'success' ? '#28a745' : '#dc3545' }};
        }
        
        .order-info h3 {
            margin-top: 0;
            color: {{ $type === 'success' ? '#28a745' : '#dc3545' }};
        }
        
        .info-row {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .label {
            font-weight: bold;
            color: #555;
        }
        
        .value {
            color: #333;
        }
        
        .customer-info {
            background-color: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
        }
        
        .order-items {
            margin: 20px 0;
        }
        
        .item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #2c1810;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 10px 5px;
            text-align: center;
        }
        
        .cta-button:hover {
            background-color: #3e2723;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Lavanya Ceramics</div>
            <p>Admin Order Management System</p>
            <div class="status-badge">
                {{ $type === 'success' ? '✓ Payment Successful' : '⚠ Payment Failed' }}
            </div>
        </div>
        
        <div class="title">Order {{ $type === 'success' ? 'Confirmation' : 'Payment Failed' }}</div>
        
        <p>Hello Admin,</p>
        
        <p>
            @if($type === 'success')
                A new order has been successfully paid and is ready for processing.
            @else
                An order payment has failed and may require attention or customer follow-up.
            @endif
        </p>
        
        <div class="order-info">
            <h3>Order Summary</h3>
            <div class="info-row">
                <span class="label">Order ID:</span>
                <span class="value">#{{ $order->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Order Date:</span>
                <span class="value">{{ $order->created_at->format('F j, Y \a\t g:i A') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Payment Status:</span>
                <span class="value" style="color: {{ $type === 'success' ? '#28a745' : '#dc3545' }}; font-weight: bold;">
                    {{ $type === 'success' ? 'PAID' : 'FAILED' }}
                </span>
            </div>
            @if($order->payment_method)
            <div class="info-row">
                <span class="label">Payment Method:</span>
                <span class="value">{{ str_replace('_', ' ', $order->payment_method) }}</span>
            </div>
            @endif
        </div>

        <div class="customer-info">
            <h3 style="margin-top: 0; color: #6c757d;">Customer Information</h3>
            <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">{{ $order->user->name }}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{ $order->user->email }}</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ $order->phone }}</span>
            </div>
            <div class="info-row">
                <span class="label">Address:</span>
                <span class="value">{{ $order->address }}, {{ $order->city }}, {{ $order->postal_code }}, {{ $order->country }}</span>
            </div>
        </div>

        <div class="order-items">
            <h3>Ordered Items</h3>
            @php
                $subtotal = 0;
                $totalProductDiscounts = 0;
            @endphp
            @foreach($order->items as $item)
                @php
                    $product = $item->product;
                    $qty = $item->quantity;
                    $unitPrice = $item->price / $qty;
                    $itemSubtotal = $unitPrice * $qty;
                    $subtotal += $itemSubtotal;
                    
                    // Calculate product discount for this item
                    $itemDiscount = 0;
                    if($product->discount && $product->discount > 0) {
                        if($product->discount_type === 'percentage') {
                            $itemDiscount = ($itemSubtotal * $product->discount) / 100;
                        } else {
                            $itemDiscount = $product->discount * $qty;
                        }
                        $totalProductDiscounts += $itemDiscount;
                    }
                @endphp
                <div class="item">
                    <div>
                        <strong>{{ $product->name }}</strong>
                        @if($item->productVariant)
                            <br><small>{{ $item->productVariant->name }}</small>
                        @endif
                        <br><small>Unit Price: Rp {{ number_format($unitPrice, 0, ',', '.') }}</small>
                        <br><small>Qty: {{ $qty }}</small>
                        @if($product->discount && $product->discount > 0)
                            <br><small style="color: #28a745; font-weight: bold;">
                                @if($product->discount_type === 'percentage')
                                    Discount: {{ $product->discount }}% (-Rp {{ number_format($itemDiscount, 0, ',', '.') }})
                                @else
                                    Discount: -Rp {{ number_format($itemDiscount, 0, ',', '.') }}
                                @endif
                            </small>
                        @endif
                    </div>
                    <div style="font-weight: bold;">
                        Rp {{ number_format($item->price, 0, ',', '.') }}
                    </div>
                </div>
            @endforeach
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid {{ $type === 'success' ? '#28a745' : '#dc3545' }};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dee2e6;">
                <span style="font-weight: bold;">Subtotal:</span>
                <span style="font-weight: bold;">Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
            </div>
            
            @if($totalProductDiscounts > 0)
            <div style="display: flex; justify-content: space-between; color: #28a745; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dee2e6;">
                <span style="font-weight: bold;">Product Discounts:</span>
                <span style="font-weight: bold;">-Rp {{ number_format($totalProductDiscounts, 0, ',', '.') }}</span>
            </div>
            @endif
            
            @if($order->coupon_discount && $order->coupon_discount > 0)
            <div style="display: flex; justify-content: space-between; color: #28a745; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dee2e6;">
                <span style="font-weight: bold;">🎫 Coupon Discount:</span>
                <span style="font-weight: bold;">-Rp {{ number_format($order->coupon_discount, 0, ',', '.') }}</span>
            </div>
            @endif
            
            <div style="display: flex; justify-content: space-between; font-size: 18px;">
                <span style="font-weight: bold;">Final Total:</span>
                <span style="font-weight: bold;">Rp {{ number_format($order->total, 0, ',', '.') }}</span>
            </div>
        </div>

        @if($type === 'success')
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #155724;">✅ Next Steps</h4>
            <ul style="color: #155724; margin: 0;">
                <li>Process the order for fulfillment</li>
                <li>Prepare items for shipment</li>
                <li>Update customer with tracking information</li>
                <li>Monitor order completion</li>
            </ul>
        </div>
        @else
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #721c24;">⚠ Required Actions</h4>
            <ul style="color: #721c24; margin: 0;">
                <li>Follow up with customer about payment failure</li>
                <li>Check if customer needs payment assistance</li>
                <li>Monitor for retry attempts</li>
                <li>Consider reaching out for alternative payment methods</li>
            </ul>
        </div>
        @endif

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ config('app.url') }}/admin/orders" class="cta-button">View All Orders</a>
            <a href="{{ config('app.url') }}/admin" class="cta-button">Admin Dashboard</a>
        </div>

        <div class="footer">
            <p>This is an automated notification from the Lavanya Ceramics Order Management System.</p>
            <p>{{ config('app.url') }} | Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        </div>
    </div>
</body>
</html>
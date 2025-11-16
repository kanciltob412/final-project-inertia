<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Lavanya Ceramics</title>
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
            border-bottom: 3px solid #2c1810;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            color: #2c1810;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .success-badge {
            background-color: #d4edda;
            color: #155724;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .title {
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2c1810;
        }
        
        .order-info h3 {
            margin-top: 0;
            color: #2c1810;
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
        
        .order-items {
            margin: 20px 0;
        }
        
        .item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: between;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .total-section {
            background-color: #2c1810;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
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
        
        .shipping-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
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
            <p>Handcrafted Excellence Since Tradition</p>
            <div class="success-badge">✓ Payment Confirmed</div>
        </div>
        
        <div class="title">Order Confirmation</div>
        
        <p>Dear {{ $order->user->name }},</p>
        
        <p>Thank you for your order! We're excited to confirm that your payment has been successfully processed and your handcrafted ceramics are being prepared with care.</p>
        
        <div class="order-info">
            <h3>Order Details</h3>
            <div class="info-row">
                <span class="label">Order Number:</span>
                <span class="value">#{{ $order->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Order Date:</span>
                <span class="value">{{ $order->created_at->format('F j, Y \a\t g:i A') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Payment Status:</span>
                <span class="value" style="color: #28a745; font-weight: bold;">PAID</span>
            </div>
            @if($order->payment_method)
            <div class="info-row">
                <span class="label">Payment Method:</span>
                <span class="value">{{ str_replace('_', ' ', $order->payment_method) }}</span>
            </div>
            @endif
        </div>

        <div class="order-items">
            <h3>Items Ordered</h3>
            @foreach($order->items as $item)
            <div class="item">
                <div style="flex: 1;">
                    <strong>{{ $item->product->name }}</strong>
                    @if($item->productVariant)
                        <br><small>{{ $item->productVariant->name }}</small>
                    @endif
                    <br><small>Unit Price: Rp {{ number_format($item->price / $item->quantity, 0, ',', '.') }}</small>
                    <br><small>Quantity: {{ $item->quantity }}</small>
                </div>
                <div style="font-weight: bold;">
                    Subtotal: Rp {{ number_format($item->price, 0, ',', '.') }}
                </div>
            </div>
            @endforeach
        </div>

        <div class="total-section">
            <div class="total-amount">
                Total: Rp {{ number_format($order->total, 0, ',', '.') }}
            </div>
        </div>

        <div class="shipping-info">
            <h4 style="margin-top: 0; color: #856404;">📦 Shipping Information</h4>
            <p style="margin-bottom: 0; color: #856404;">
                <strong>Shipping Address:</strong><br>
                {{ $order->address }}<br>
                {{ $order->city }}, {{ $order->postal_code }}<br>
                {{ $order->country }}<br>
                <strong>Phone:</strong> {{ $order->phone }}
            </p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
            <p><strong>What happens next?</strong></p>
            <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                <p>1. <strong>Processing:</strong> Your order is being prepared (1-2 business days)</p>
                <p>2. <strong>Quality Check:</strong> Each piece is carefully inspected</p>
                <p>3. <strong>Shipping:</strong> You'll receive tracking information via email</p>
                <p>4. <strong>Delivery:</strong> Your beautiful ceramics arrive at your door</p>
            </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ config('app.url') }}" class="cta-button">Continue Shopping</a>
            <a href="{{ config('app.url') }}/contact" class="cta-button">Contact Support</a>
        </div>

        <div class="footer">
            <p>Thank you for choosing Lavanya Ceramics - where tradition meets modern craftsmanship.</p>
            <p>{{ config('app.url') }} | Email: info@lavanyaceramics.com</p>
            <p><small>This is an automated confirmation email. Please do not reply directly to this message.</small></p>
        </div>
    </div>
</body>
</html>
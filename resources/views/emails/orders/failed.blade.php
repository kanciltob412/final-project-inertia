<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Lavanya Ceramics</title>
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
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            color: #2c1810;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .failed-badge {
            background-color: #f8d7da;
            color: #721c24;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        
        .title {
            color: #dc3545;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
        }
        
        .order-info h3 {
            margin-top: 0;
            color: #dc3545;
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
        
        .retry-section {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
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
        
        .cta-button.retry {
            background-color: #dc3545;
        }
        
        .cta-button.retry:hover {
            background-color: #c82333;
        }
        
        .troubleshooting {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
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
            <div class="failed-badge">⚠ Payment Failed</div>
        </div>
        
        <div class="title">Payment Unsuccessful</div>
        
        <p>Dear {{ $order->user->name }},</p>
        
        <p>We're sorry to inform you that we were unable to process your payment for order #{{ $order->id }}. Don't worry - your items are still reserved and you can easily retry your payment.</p>
        
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
                <span class="label">Order Total:</span>
                <span class="value" style="font-weight: bold;">Rp {{ number_format($order->total, 0, ',', '.') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Payment Status:</span>
                <span class="value" style="color: #dc3545; font-weight: bold;">FAILED</span>
            </div>
        </div>

        <div class="retry-section">
            <h4 style="margin-top: 0; color: #856404;">🔄 Retry Your Payment</h4>
            <p style="color: #856404; margin-bottom: 15px;">
                Your order is reserved for <strong>24 hours</strong>. You can retry your payment using the same or different payment method.
            </p>
            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/payment-success?order_id={{ $order->id }}" class="cta-button retry">Retry Payment Now</a>
            </div>
        </div>

        <div class="troubleshooting">
            <h4 style="margin-top: 0; color: #6c757d;">💡 Common Solutions</h4>
            <p style="color: #6c757d; margin-bottom: 10px;">Your payment might have failed due to:</p>
            <ul style="color: #6c757d; margin: 0;">
                <li>Insufficient funds in your account</li>
                <li>Card details entered incorrectly</li>
                <li>Bank declining the transaction</li>
                <li>Network connectivity issues</li>
                <li>Payment timeout</li>
            </ul>
            <p style="color: #6c757d; margin-top: 15px; margin-bottom: 0;">
                <strong>Tip:</strong> Try using a different payment method or contact your bank to ensure online transactions are enabled.
            </p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
            <p><strong>Need help with your payment?</strong></p>
            <a href="{{ config('app.url') }}/contact" class="cta-button">Contact Support</a>
            <a href="{{ config('app.url') }}" class="cta-button">Continue Shopping</a>
        </div>

        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460; text-align: center;">
                <strong>Order Reservation:</strong> Your items are held for 24 hours. Complete your payment to secure your handcrafted ceramics.
            </p>
        </div>

        <div class="footer">
            <p>We're here to help! Contact us at info@lavanyaceramics.com for payment assistance.</p>
            <p>{{ config('app.url') }} | Lavanya Ceramics Support Team</p>
            <p><small>This is an automated payment notification. Please do not reply directly to this message.</small></p>
        </div>
    </div>
</body>
</html>
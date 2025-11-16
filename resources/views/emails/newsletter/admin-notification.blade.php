<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Newsletter Subscription</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2c1810;
        }
        h1 {
            color: #2c1810;
            margin: 0;
        }
        .notification-badge {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        .subscriber-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2c1810;
        }
        .subscriber-info h3 {
            margin-top: 0;
            color: #2c1810;
        }
        .info-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            min-width: 120px;
        }
        .info-value {
            color: #333;
            font-family: monospace;
            background-color: #e9ecef;
            padding: 4px 8px;
            border-radius: 3px;
        }
        .stats {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .cta-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #2c1810;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
            font-weight: bold;
        }
        .cta-button.secondary {
            background-color: #6c757d;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="notification-badge">NEW SUBSCRIPTION</div>
            <h1>Newsletter Subscription Alert</h1>
            <p>A new user has subscribed to the Lavanya Ceramics newsletter</p>
        </div>

        <div class="subscriber-info">
            <h3>Subscriber Information</h3>
            <div class="info-row">
                <span class="info-label">Email Address:</span>
                <span class="info-value">{{ $subscription->email }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Subscription Date:</span>
                <span class="info-value">{{ $subscription->created_at->format('F j, Y') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Subscription Time:</span>
                <span class="info-value">{{ $subscription->created_at->format('g:i A T') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" style="background-color: {{ $subscription->is_active ? '#d1fae5' : '#fee2e2' }}; color: {{ $subscription->is_active ? '#047857' : '#dc2626' }};">
                    {{ $subscription->is_active ? 'Active' : 'Inactive' }}
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Email Verified:</span>
                <span class="info-value" style="background-color: {{ $subscription->email_verified_at ? '#d1fae5' : '#fef3c7' }}; color: {{ $subscription->email_verified_at ? '#047857' : '#d97706' }};">
                    {{ $subscription->email_verified_at ? 'Verified' : 'Pending' }}
                </span>
            </div>
        </div>

        <div class="stats">
            <p><strong>Subscriber ID:</strong> #{{ $subscription->id }}</p>
            <p style="font-size: 14px; color: #666; margin: 10px 0;">
                This subscriber will now receive your newsletter updates and promotional content.
            </p>
        </div>

        <div class="cta-buttons">
            <a href="{{ config('app.url') }}/admin/newsletter" class="cta-button">View All Subscribers</a>
            <a href="{{ config('app.url') }}/admin/dashboard" class="cta-button secondary">Admin Dashboard</a>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">📧 Next Steps:</h4>
            <ul style="margin-bottom: 0; color: #856404;">
                <li>A welcome email has been sent to the subscriber</li>
                <li>Consider adding them to your email marketing campaigns</li>
                <li>Monitor engagement and subscription preferences</li>
            </ul>
        </div>

        <div class="footer">
            <p><strong>Lavanya Ceramics Admin Panel</strong><br>
            This is an automated notification from your website.<br>
            Generated on {{ now()->format('F j, Y \a\t g:i A T') }}</p>
            
            <p style="font-size: 12px; color: #999;">
                You're receiving this email because you're an administrator of {{ config('app.name') }}.<br>
                To manage email preferences, visit your admin dashboard.
            </p>
        </div>
    </div>
</body>
</html>
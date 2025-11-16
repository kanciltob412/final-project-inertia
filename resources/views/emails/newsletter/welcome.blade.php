<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Lavanya Ceramics Newsletter</title>
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
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 200px;
            height: auto;
        }
        h1 {
            color: #2c1810;
            margin: 20px 0;
        }
        .content {
            margin: 20px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #2c1810;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            margin: 0 10px;
            color: #2c1810;
            text-decoration: none;
        }
        .benefits {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
        }
        .benefits li {
            margin: 8px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Lavanya Ceramics!</h1>
            <p>Thank you for subscribing to our newsletter</p>
        </div>

        <div class="content">
            <p>Dear Ceramic Enthusiast,</p>
            
            <p>Welcome to the Lavanya Ceramics family! We're thrilled to have you join our community of ceramic art lovers and collectors.</p>

            <div class="benefits">
                <h3>What to expect from our newsletter:</h3>
                <ul>
                    <li><strong>Exclusive Collections:</strong> Be the first to discover our latest ceramic masterpieces</li>
                    <li><strong>Craftsmanship Stories:</strong> Behind-the-scenes insights into our artisan techniques</li>
                    <li><strong>Special Offers:</strong> Subscriber-only discounts and early access to sales</li>
                    <li><strong>Design Inspiration:</strong> Tips for incorporating ceramics into your space</li>
                    <li><strong>Event Invitations:</strong> Exclusive invites to exhibitions and workshops</li>
                </ul>
            </div>

            <p>Your subscription email: <strong>{{ $subscription->email }}</strong></p>
            
            <p>We respect your inbox and will only send you meaningful content about our ceramic collections, craftsmanship insights, and exclusive offers.</p>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}" class="cta-button">Explore Our Collections</a>
            </div>

            <p>If you have any questions or would like to learn more about our ceramics, feel free to reach out to us anytime.</p>
        </div>

        <div class="footer">
            <div class="social-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
            </div>
            
            <p><strong>Lavanya Ceramics</strong><br>
            Crafting Excellence Since Our Beginning<br>
            Email: info@lavanyaceramics.com<br>
            Website: {{ config('app.url') }}</p>
            
            <p style="font-size: 12px; color: #999;">
                You're receiving this email because you subscribed to our newsletter at {{ config('app.name') }}.<br>
                If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.
            </p>
        </div>
    </div>
</body>
</html>
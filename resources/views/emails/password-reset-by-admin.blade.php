<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Lavanya Ceramics</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #000;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #000;
            padding: 15px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #000;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">LAVANYA CERAMICS</div>
        </div>

        <div class="title">Password Reset Notification</div>

        <div class="content">
            <p>Hello {{ $user->name }},</p>
            
            <p>We are writing to inform you that your password has been successfully reset by our administrator.</p>

            <div class="info-box">
                <strong>Account Details:</strong><br>
                Email: {{ $user->email }}<br>
                Date: {{ now()->format('F d, Y \a\t h:i A') }}
            </div>

            <p>Your new password has been set and you can now use it to log in to your account.</p>

            <div class="warning">
                <strong>⚠️ Security Reminder:</strong><br>
                For security reasons, we recommend that you change your password after logging in. You can do this by going to your account settings.
            </div>

            <p style="text-align: center;">
                <a href="{{ url('/login') }}" class="button">Login to Your Account</a>
            </p>

            <p>If you did not request this password reset or have any concerns about your account security, please contact our support team immediately.</p>
        </div>

        <div class="footer">
            <p>
                <strong>Lavanya Ceramics</strong><br>
                Handcrafted ceramic artistry<br>
                © {{ date('Y') }} Lavanya Ceramics. All rights reserved.
            </p>
            <p style="margin-top: 15px;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>

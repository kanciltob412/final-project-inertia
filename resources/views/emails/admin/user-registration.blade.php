<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration - Lavanya Ceramics</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #8B4513;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            color: #8B4513;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .title {
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .content {
            margin-bottom: 30px;
        }
        
        .user-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #8B4513;
        }
        
        .user-info h3 {
            margin-top: 0;
            color: #8B4513;
        }
        
        .info-row {
            margin-bottom: 10px;
        }
        
        .label {
            font-weight: bold;
            color: #555;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #8B4513;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 5px;
        }
        
        .cta-button:hover {
            background-color: #A0522D;
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
            <p>Crafting Excellence Since Tradition</p>
        </div>
        
        <div class="title">🎉 New User Registration</div>
        
        <div class="content">
            <p>Hello Admin,</p>
            
            <p>A new user has registered on the Lavanya Ceramics website. Here are the details:</p>
            
            <div class="user-info">
                <h3>User Information</h3>
                <div class="info-row">
                    <span class="label">Name:</span> {{ $user->name }}
                </div>
                <div class="info-row">
                    <span class="label">Email:</span> {{ $user->email }}
                </div>
                <div class="info-row">
                    <span class="label">Registration Date:</span> {{ $user->created_at->format('F j, Y \a\t g:i A') }}
                </div>
                <div class="info-row">
                    <span class="label">User ID:</span> #{{ $user->id }}
                </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the user's profile in the admin dashboard</li>
                <li>Monitor their activity and engagement</li>
                <li>Consider sending a welcome follow-up if needed</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ config('app.url') }}/admin/users" class="cta-button">View All Users</a>
                <a href="{{ config('app.url') }}/admin" class="cta-button">Admin Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Lavanya Ceramics Admin System.</p>
            <p>{{ config('app.url') }} | Lavanya Ceramics Team</p>
            <p><small>Generated on {{ now()->format('F j, Y \a\t g:i A') }}</small></p>
        </div>
    </div>
</body>
</html>
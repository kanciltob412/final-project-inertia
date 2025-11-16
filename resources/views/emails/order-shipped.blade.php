<x-mail::message>
# 📦 Your Order Has Been Shipped!

Hello {{ $customerName }},

Great news! Your order from **Lavanya Ceramics** has been shipped and is on its way to you.

## Order Details
- **Order Number:** #{{ $order->id }}
- **Shipped Date:** {{ $shippedDate }}
- **Courier:** {{ $courierName }}
- **Tracking Number:** {{ $trackingNumber }}

## Shipping Information
Your beautiful ceramic pieces have been carefully packaged and handed over to **{{ $courierName }}** for delivery.

<x-mail::panel>
**Tracking Number:** {{ $trackingNumber }}

You can track your shipment using the tracking number above on your courier's website or mobile app.
</x-mail::panel>

## What's Next?
- Your package is now in transit
- You'll receive delivery updates from {{ $courierName }}
- Estimated delivery depends on your location and shipping method
- Please ensure someone is available to receive the package

## Order Summary
@if($order->items && $order->items->count() > 0)
@foreach($order->items as $item)
- {{ $item->product->name ?? 'Product' }} (Qty: {{ $item->quantity }}) - Rp {{ number_format($item->price, 0, ',', '.') }}
@endforeach
@endif

**Total: Rp {{ number_format($order->total, 0, ',', '.') }}**

<x-mail::button url="{{ config('app.url') }}" color="black">
Visit Our Store
</x-mail::button>

We hope you'll love your new ceramic pieces! If you have any questions about your shipment or need assistance, please don't hesitate to contact us.

Thank you for choosing **Lavanya Ceramics** - where tradition meets artistry.

Best regards,<br>
**The Lavanya Ceramics Team**

---
*This email was sent regarding Order #{{ $order->id }}. If you have any questions, please contact our customer service team.*
</x-mail::message>

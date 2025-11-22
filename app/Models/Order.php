<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Order extends Model
{
    use HasFactory;

    protected $table = 'order';
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
        'total',
        'status',
        'url',
        'payment_method',
        'payment_channel',
        'paid_at',
        'courier_name',
        'tracking_number',
        'shipped_at',
        'shipping_courier',
        'shipping_service',
        'shipping_cost',
        'destination_city_id',
        'coupon_id',
        'coupon_discount',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_item';
    protected $fillable = [
        'order_id',
        'product_id',
        'price',
        'quantity',
        'discount',
        'discount_type',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Helper method to get the product info
    public function getProductInfo(): Product
    {
        return $this->product;
    }
}

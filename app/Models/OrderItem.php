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
        'product_variant_id',
        'price',
        'quantity',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
    
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    // Helper method to get the correct product info based on variant or direct product
    public function getProductInfo(): Product
    {
        return $this->productVariant ? $this->productVariant->product : $this->product;
    }

    // Helper method to get variant info (color, stock, etc.)
    public function getVariantInfo(): ?ProductVariant
    {
        return $this->productVariant;
    }
}

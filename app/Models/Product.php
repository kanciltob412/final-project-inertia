<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'category_id',
        'description',
        'dimension',
        'stock',
        'price',
        'image',
        'is_active',
        'discount',
        'discount_type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function activeVariants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->where('is_active', true);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true);
    }

    // Helper method to get total stock across all variants
    public function getTotalStock(): int
    {
        return $this->variants()->sum('stock');
    }

    // Helper method to check if product has any stock
    public function hasStock(): bool
    {
        return $this->getTotalStock() > 0;
    }

    // Helper method to check if product has variants
    public function hasVariants(): bool
    {
        return $this->variants()->count() > 0;
    }

    // Get effective values (from variant if exists, otherwise from product)
    public function getEffectivePrice()
    {
        if ($this->hasVariants()) {
            // Return null or range - frontend should use variant prices
            return null;
        }
        return $this->price;
    }

    public function getEffectiveStock()
    {
        if ($this->hasVariants()) {
            return $this->getTotalStock();
        }
        return $this->stock;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->sku)) {
                $product->sku = 'PRD-' . strtoupper(uniqid());
            }
        });
    }
}

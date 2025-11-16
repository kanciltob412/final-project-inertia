<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'usage_limit',
        'used_count',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'expiry_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Check if coupon is valid for use
     */
    public function isValid(): bool
    {
        // Check if active
        if (!$this->is_active) {
            return false;
        }

        // Check if expired
        if ($this->expiry_date && $this->expiry_date->isPast()) {
            return false;
        }

        // Check if usage limit reached
        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Get validation error message if coupon is invalid
     */
    public function getValidationError(): ?string
    {
        if (!$this->is_active) {
            return 'This coupon is not active.';
        }

        if ($this->expiry_date && $this->expiry_date->isPast()) {
            return 'This coupon has expired.';
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return 'This coupon has reached its usage limit.';
        }

        return null;
    }

    /**
     * Calculate discount amount for a given price
     */
    public function calculateDiscount(float $price): float
    {
        if ($this->discount_type === 'fixed') {
            return min($this->discount_value, $price); // Prevent negative price
        } else { // percentage
            return ($price * $this->discount_value) / 100;
        }
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }
}

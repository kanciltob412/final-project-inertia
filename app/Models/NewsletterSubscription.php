<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'email_verified_at',
        'is_active',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Scope for active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if email is already subscribed.
     */
    public static function isSubscribed(string $email): bool
    {
        return self::where('email', $email)->exists();
    }
}

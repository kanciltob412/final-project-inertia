<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $table = 'customer_addresses';

    protected $fillable = [
        'user_id',
        'address_type',
        'recipient_name',
        'phone',
        'street_address',
        'city',
        'state',
        'postal_code',
        'country',
        'notes',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

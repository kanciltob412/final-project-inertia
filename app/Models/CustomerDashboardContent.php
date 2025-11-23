<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerDashboardContent extends Model
{
    protected $table = 'customer_dashboard_content';

    protected $fillable = [
        'type',
        'title',
        'description',
        'image_url',
        'link_url',
        'content',
        'start_date',
        'end_date',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];
}

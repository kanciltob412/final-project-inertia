<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemberPromo extends Model
{
    protected $table = 'member_promos';

    protected $fillable = [
        'title',
        'description',
        'type',
        'image_url',
        'link_url',
        'start_date',
        'end_date',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];
}

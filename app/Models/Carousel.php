<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image_path',
        'button_1_text',
        'button_1_url',
        'button_2_text',
        'button_2_url',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

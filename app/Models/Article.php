<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'seo_keywords',
        'excerpt',
        'content',
        'featured_image',
        'category',
        'tags',
        'author_name',
        'reading_time',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'reading_time' => 'integer',
    ];
}

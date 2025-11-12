<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'The Art of Ceramic Craftsmanship',
                'slug' => 'art-of-ceramic-craftsmanship',
                'seo_keywords' => 'ceramics, craftsmanship, handmade, pottery',
                'excerpt' => 'Exploring the timeless art of ceramic craftsmanship and its modern applications in luxury spaces.',
                'content' => '<p>Ceramic craftsmanship has been an integral part of human civilization for thousands of years. At Lavanya Ceramics, we continue this ancient tradition while incorporating modern design sensibilities.</p><p>Our artisans spend years perfecting their techniques, ensuring each piece meets our exacting standards for quality and beauty. The process begins with carefully selected clay, which is shaped, fired, and glazed using methods passed down through generations.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
                'category' => 'Craftsmanship',
                'tags' => 'ceramics, handmade, luxury, craftsmanship',
                'author_name' => 'Master Artisan Kadek',
                'reading_time' => 8,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Sustainable Ceramics: Our Eco-Friendly Approach',
                'slug' => 'sustainable-ceramics-eco-friendly-approach',
                'seo_keywords' => 'sustainable, eco-friendly, ceramics, environment',
                'excerpt' => 'Learn about our commitment to sustainable practices in ceramic production and environmental responsibility.',
                'content' => '<p>At Lavanya Ceramics, we believe in creating beautiful pieces while respecting our planet. Our sustainable approach includes using locally sourced materials, energy-efficient kilns, and water recycling systems.</p><p>Every step of our production process is designed to minimize environmental impact while maintaining the highest quality standards.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
                'category' => 'Sustainability',
                'tags' => 'sustainable, eco-friendly, environment, green',
                'author_name' => 'Environmental Officer Sarah',
                'reading_time' => 6,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'title' => 'Modern Ceramic Designs for Contemporary Spaces',
                'slug' => 'modern-ceramic-designs-contemporary-spaces',
                'seo_keywords' => 'modern, contemporary, design, interior, ceramics',
                'excerpt' => 'Discover how modern ceramic designs can transform contemporary living and working spaces.',
                'content' => '<p>Contemporary spaces require pieces that balance form and function. Our modern ceramic designs seamlessly integrate into today\'s interiors while adding warmth and character.</p><p>From minimalist dinnerware to statement decorative pieces, our collection offers versatile options for every space.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
                'category' => 'Design',
                'tags' => 'modern, contemporary, interior design, minimalist',
                'author_name' => 'Design Director Maya',
                'reading_time' => 5,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'title' => 'The Journey from Clay to Ceramic Masterpiece',
                'slug' => 'journey-clay-to-ceramic-masterpiece',
                'seo_keywords' => 'clay, ceramic, process, handmade, artisan',
                'excerpt' => 'Follow the fascinating journey of raw clay as it transforms into a finished ceramic masterpiece.',
                'content' => '<p>The transformation of clay into ceramic art is a magical process that combines ancient techniques with modern precision. It begins with selecting the finest clay, which is then carefully prepared and shaped by skilled hands.</p><p>The firing process is critical, with temperatures reaching over 1200°C to achieve the perfect strength and finish. Each piece is unique, bearing the subtle marks of its handmade creation.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800',
                'category' => 'Process',
                'tags' => 'process, handmade, artisan, creation',
                'author_name' => 'Production Manager Wayan',
                'reading_time' => 7,
                'is_featured' => false,
                'status' => 'published',
            ],
        ];

        foreach ($articles as $articleData) {
            Article::firstOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
    }
}

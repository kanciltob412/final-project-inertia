<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home');
    }

    public function products()
    {
        $query = Product::with('category');

        // Search functionality
        if (request('search')) {
            $query->where('name', 'like', '%' . request('search') . '%')
                  ->orWhere('description', 'like', '%' . request('search') . '%');
        }

        // Category filter
        if (request('category') && request('category') !== 'All') {
            $query->whereHas('category', function($q) {
                $q->where('name', request('category'));
            });
        }

        // Price range filter
        if (request('min_price')) {
            $query->where('price', '>=', request('min_price'));
        }
        if (request('max_price')) {
            $query->where('price', '<=', request('max_price'));
        }

        // Sorting
        $sortBy = request('sort', 'name');
        switch($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
        }

        $products = $query->paginate(12)->appends(request()->query());
        $categories = \App\Models\Category::all();

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'min_price' => request('min_price'),
                'max_price' => request('max_price'),
                'sort' => request('sort', 'name')
            ]
        ]);
    }

    public function productDetail(int $id)
    {
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function cart()
    {
        return Inertia::render('Cart');
    }

    public function checkout()
    {
        return Inertia::render('Checkout');
    }

    public function articles()
    {
        // Get current page from request
        $currentPage = request()->get('page', 1);
        
        // Get the featured article only for page 1
        $featuredArticle = null;
        if ($currentPage == 1) {
            $featuredArticle = \App\Models\Article::where('status', 'published')
                ->where('is_featured', true)
                ->first();
        }

        // Get regular articles (excluding featured ones) with pagination
        $articles = \App\Models\Article::where('status', 'published')
            ->where('is_featured', false)
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        // Add the featured article to the paginated data only for page 1
        if ($featuredArticle && $currentPage == 1) {
            $articlesData = $articles->toArray();
            // Insert featured article at the beginning of the data array
            $articlesData['featured_article'] = $featuredArticle;
            $articles = $articlesData;
        }

        return Inertia::render('Articles', [
            'articles' => $articles
        ]);
    }

    public function articleDetail(int $id)
    {
        $article = \App\Models\Article::where('status', 'published')
            ->findOrFail($id);

        return Inertia::render('ArticleDetail', [
            'article' => $article,
        ]);
    }
    public function craftsmanship()
    {
        return Inertia::render('Craftsmanship');
    }
}

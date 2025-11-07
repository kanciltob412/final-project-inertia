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
        $products = Product::with('category')->get();
        return Inertia::render('Products', [
            'products' => $products
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
        return Inertia::render('Articles');
    }

    public function articleDetail(int $id)
    {
        return Inertia::render('ArticleDetail', [
            'id' => $id,
        ]);
    }
    public function craftsmanship()
    {
        return Inertia::render('Craftsmanship');
    }
}

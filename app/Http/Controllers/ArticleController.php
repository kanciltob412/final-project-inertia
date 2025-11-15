<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;


class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Article/index", [
            "data" => Article::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Article/form", [
            "categories" => Category::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'seo_keywords' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|string|max:255',
            'author_name' => 'nullable|string|max:255',
            'reading_time' => 'nullable|integer',
            'is_featured' => 'boolean',
            'status' => 'nullable|in:draft,published',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('articles', 'public');
        }
        Article::create($validated);
        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $article = Article::findOrFail($id);
        return Inertia::render("Article/form", [
            "article" => $article,
            "categories" => Category::all()
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);
        
        // Check if it's a bulk status update (only status field)
        if ($request->has('status') && count($request->all()) === 1) {
            $validated = $request->validate([
                'status' => 'required|in:draft,published',
            ]);
            $article->update($validated);
            return redirect()->route('articles.index')->with('success', 'Article status updated successfully.');
        }
        
        // Full form update
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug,' . $article->id,
            'seo_keywords' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|string|max:255',
            'author_name' => 'nullable|string|max:255',
            'reading_time' => 'nullable|integer',
            'is_featured' => 'boolean',
            'status' => 'nullable|in:draft,published',
        ]);

        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('articles', 'public');
        } else {
            $validated['featured_image'] = $article->featured_image;
        }
        $article->update($validated);
        return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
    }

    public function destroy(string $id)
    {
        $article = Article::findOrFail($id);
        // Delete featured image if exists
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }
        $article->delete();
        return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
    }

    /**
     * Bulk update article status.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:articles,id',
            'status' => 'required|in:draft,published'
        ]);

        Article::whereIn('id', $validated['ids'])
            ->update(['status' => $validated['status']]);

        $message = "Articles status updated to {$validated['status']} successfully.";
        
        return back()->with('success', $message);
    }

    /**
     * Duplicate an article.
     */
    public function duplicate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:articles,id',
        ]);

        $originalArticle = Article::findOrFail($validated['id']);
        
        Article::create([
            'title' => $originalArticle->title . ' (Copy)',
            'slug' => $originalArticle->slug . '-copy-' . time(),
            'seo_keywords' => $originalArticle->seo_keywords,
            'excerpt' => $originalArticle->excerpt,
            'content' => $originalArticle->content,
            'featured_image' => $originalArticle->featured_image, // Note: This copies the same image reference
            'category' => $originalArticle->category,
            'tags' => $originalArticle->tags,
            'author_name' => $originalArticle->author_name,
            'reading_time' => $originalArticle->reading_time,
            'is_featured' => false, // Set as not featured by default
            'status' => 'draft', // Set as draft by default
        ]);

        return back()->with('success', 'Article duplicated successfully.');
    }
}

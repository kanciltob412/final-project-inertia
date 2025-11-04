<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Category/index", [
            "data" => Category::all()
        ]);
        /*return Inertia::render("Category/index", [
            "data" => Category::all()
    ]); */ 
  }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Category/form");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255"
        ]);

        DB::transaction(function () use ($validated) {
            Category::create($validated);
        });

        return redirect()->route("categories.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render("Category/show", [
            "id" => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render("Category/form", [
            "category" => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255"
        ]);

        DB::transaction(function () use ($validated, $id) {
            $category = Category::findOrFail($id);
            $category->update($validated);
        });

        return redirect()->route("categories.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            $category = Category::findOrFail($id);
            $category->delete();
        });

        return redirect()->route("categories.index");
    }
}

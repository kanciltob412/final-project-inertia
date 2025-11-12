<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Product/index", [
            "data" => Product::with("category")->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Product/form", [
            "categories" => Category::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "category_id" => "required|exists:categories,id",
            "name" => "required|string|max:255",
            "description" => "required|string",
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
            "color" => "required|string|max:100",
            "image" => "required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048",
        ]);
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($validated);


        return redirect()->route("products.index")->with("success", "Product created successfully.");
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
        $product = Product::findOrFail($id);
        return Inertia::render("Product/form", [
            "product" => $product,
            "categories" => Category::all()
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            "category_id" => "required|exists:categories,id",
            "name" => "required|string|max:255",
            "description" => "required|string",
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
            "color" => "required|string|max:100",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048",
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }
        else {
            $validated['image'] = $product->image;
        }
        $product->update($validated);

        return redirect()->route("products.index")->with("success", "Product updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        // Delete image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();

        return redirect()->route("products.index")->with("success", "Product deleted successfully.");
    }

    /**
     * Bulk update product status (activate/deactivate).
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
            'status' => 'required|in:active,inactive'
        ]);

        $isActive = $validated['status'] === 'active';
        
        Product::whereIn('id', $validated['ids'])
            ->update(['is_active' => $isActive]);

        $message = $isActive ? 'Products activated successfully.' : 'Products deactivated successfully.';
        
        return back()->with('success', $message);
    }

    /**
     * Duplicate a product.
     */
    public function duplicate(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:products,id',
        ]);

        $originalProduct = Product::findOrFail($validated['id']);
        
        Product::create([
            'category_id' => $originalProduct->category_id,
            'name' => $originalProduct->name . ' (Copy)',
            'description' => $originalProduct->description,
            'price' => $originalProduct->price,
            'stock' => $originalProduct->stock,
            'color' => $originalProduct->color,
            'image' => $originalProduct->image, // Note: This copies the same image reference
            'is_active' => $originalProduct->is_active,
        ]);

        return back()->with('success', 'Product duplicated successfully.');
    }
}

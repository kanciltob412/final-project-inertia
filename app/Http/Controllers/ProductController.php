<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Product/index", [
            "data" => Product::with(["category"])->get()
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
            "sku" => "required|string|max:255|unique:products,sku",
            "name" => "required|string|max:255",
            "description" => "required|string",
            "stock" => "nullable|integer|min:0",
            "price" => "required|numeric|min:0",
            "discount" => "nullable|numeric|min:0",
            "discount_type" => "nullable|in:fixed,percentage",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048",
            "gallery_images" => "nullable|array",
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Create the base product (image will be set from first gallery image)
            $productData = [
                'sku' => $validated['sku'],
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
                'stock' => $validated['stock'] ?? 0,
                'price' => $validated['price'],
                'discount' => $validated['discount'] ?? 0,
                'discount_type' => $validated['discount_type'] ?? 'fixed',
                'image' => null, // Will be set from first gallery image
            ];

            $product = Product::create($productData);

            // Handle gallery images - first image becomes the main product image
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $index => $imageFile) {
                    $imagePath = $imageFile->store('products', 'public');
                    $isFirst = $index === 0;

                    // Set first image as product's main image
                    if ($isFirst) {
                        $product->update(['image' => $imagePath]);
                    }

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt_text' => '',
                        'sort_order' => $index,
                        'is_primary' => $isFirst,
                    ]);
                }
            }
        });

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
        $product = Product::with(['images'])->findOrFail($id);
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
            "sku" => "required|string|max:255|unique:products,sku," . $id,
            "name" => "required|string|max:255",
            "description" => "required|string",
            "stock" => "nullable|integer|min:0",
            "price" => "required|numeric|min:0",
            "discount" => "nullable|numeric|min:0",
            "discount_type" => "nullable|in:fixed,percentage",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048",
            "gallery_images" => "nullable|array",
        ]);

        DB::transaction(function () use ($validated, $request, $product) {
            // Update product base information
            $productData = [
                'sku' => $validated['sku'],
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
                'stock' => $validated['stock'] ?? 0,
                'price' => $validated['price'],
                'discount' => $validated['discount'] ?? 0,
                'discount_type' => $validated['discount_type'] ?? 'fixed',
            ];

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $productData['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($productData);

            // Handle gallery images
            if ($request->hasFile('gallery_images')) {
                // Delete existing gallery images
                $existingImages = $product->images;
                foreach ($existingImages as $img) {
                    Storage::disk('public')->delete($img->image_path);
                }
                $product->images()->delete();

                // Create new gallery images - first image becomes the main product image
                foreach ($request->file('gallery_images') as $index => $imageFile) {
                    $imagePath = $imageFile->store('products', 'public');
                    $isFirst = $index === 0;

                    // Set first image as product's main image
                    if ($isFirst) {
                        $product->update(['image' => $imagePath]);
                    }

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt_text' => '',
                        'sort_order' => $index,
                        'is_primary' => $isFirst,
                    ]);
                }
            }
        });

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
        Log::info('Bulk update request received', [
            'user_id' => Auth::user() ? Auth::user()->id : null
        ]);

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
            'status' => 'required|in:active,inactive'
        ]);

        $isActive = $validated['status'] === 'active';

        $updated = Product::whereIn('id', $validated['ids'])
            ->update(['is_active' => $isActive]);

        $message = $isActive ? 'Products activated successfully.' : 'Products deactivated successfully.';

        Log::info('Bulk update completed', [
            'updated_count' => $updated,
            'message' => $message
        ]);

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

        DB::transaction(function () use ($originalProduct) {
            // Generate a new unique SKU
            $newSku = 'PRD-' . strtoupper(uniqid());

            $newProduct = Product::create([
                'sku' => $newSku,
                'category_id' => $originalProduct->category_id,
                'name' => $originalProduct->name . ' (Copy)',
                'description' => $originalProduct->description,
                'dimension' => $originalProduct->dimension,
                'stock' => $originalProduct->stock,
                'price' => $originalProduct->price,
                'discount' => $originalProduct->discount,
                'discount_type' => $originalProduct->discount_type,
                'image' => $originalProduct->image,
                'is_active' => $originalProduct->is_active,
            ]);
        });

        return back()->with('success', 'Product duplicated successfully.');
    }
}

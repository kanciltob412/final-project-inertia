<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Product/index", [
            "data" => Product::with(["category", "variants"])->get()
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
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048",
            "gallery_images" => "nullable|array",
            "variants" => "required|array|min:1",
            "variants.*.color" => "required|string|max:100",
            "variants.*.stock" => "required|integer|min:0",
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Create the base product
            $productData = [
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
            ];

            // Handle legacy single image
            if ($request->hasFile('image')) {
                $productData['image'] = $request->file('image')->store('products', 'public');
            }

            $product = Product::create($productData);

            // Handle gallery images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $index => $imageFile) {
                    $imagePath = $imageFile->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt_text' => '',
                        'sort_order' => $index,
                        'is_primary' => $index === 0, // First image is primary
                    ]);
                }
            }

            // Create variants for the product
            foreach ($validated['variants'] as $variantData) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color' => $variantData['color'],
                    'stock' => $variantData['stock'],
                    'image' => $product->image, // Use same image for now
                ]);
            }
        });

        return redirect()->route("products.index")->with("success", "Product created successfully with variants.");
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
        $product = Product::with(['variants', 'images'])->findOrFail($id);
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
        $product = Product::with('variants')->findOrFail($id);
        $validated = $request->validate([
            "category_id" => "required|exists:categories,id",
            "name" => "required|string|max:255",
            "description" => "required|string",
            "price" => "required|numeric|min:0",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048",
            "gallery_images" => "nullable|array",
            "variants" => "required|array|min:1",
            "variants.*.id" => "nullable|exists:product_variants,id",
            "variants.*.color" => "required|string|max:100",
            "variants.*.stock" => "required|integer|min:0",
        ]);

        DB::transaction(function () use ($validated, $request, $product) {
            // Update product base information
            $productData = [
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
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

                // Create new gallery images
                foreach ($request->file('gallery_images') as $index => $imageFile) {
                    $imagePath = $imageFile->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'alt_text' => '',
                        'sort_order' => $index,
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            // Handle variants
            $existingVariantIds = $product->variants->pluck('id')->toArray();
            $submittedVariantIds = collect($validated['variants'])->pluck('id')->filter()->toArray();

            // Delete removed variants
            $variantsToDelete = array_diff($existingVariantIds, $submittedVariantIds);
            ProductVariant::whereIn('id', $variantsToDelete)->delete();

            // Update or create variants
            foreach ($validated['variants'] as $variantData) {
                if (isset($variantData['id'])) {
                    // Update existing variant
                    $variant = ProductVariant::find($variantData['id']);
                    $variant->update([
                        'color' => $variantData['color'],
                        'stock' => $variantData['stock'],
                    ]);
                } else {
                    // Create new variant
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color' => $variantData['color'],
                        'stock' => $variantData['stock'],
                        'image' => $product->image,
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

        $originalProduct = Product::with('variants')->findOrFail($validated['id']);
        
        DB::transaction(function () use ($originalProduct) {
            $newProduct = Product::create([
                'category_id' => $originalProduct->category_id,
                'name' => $originalProduct->name . ' (Copy)',
                'description' => $originalProduct->description,
                'price' => $originalProduct->price,
                'image' => $originalProduct->image, // Note: This copies the same image reference
                'is_active' => $originalProduct->is_active,
            ]);

            // Duplicate all variants
            foreach ($originalProduct->variants as $variant) {
                ProductVariant::create([
                    'product_id' => $newProduct->id,
                    'color' => $variant->color,
                    'stock' => $variant->stock,
                    'image' => $variant->image,
                    'is_active' => $variant->is_active,
                ]);
            }
        });

        return back()->with('success', 'Product duplicated successfully with all variants.');
    }
}

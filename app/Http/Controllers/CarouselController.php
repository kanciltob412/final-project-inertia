<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Carousel/index', [
            'carousels' => Carousel::orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Carousel/form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'button_1_text' => 'nullable|string|max:100',
            'button_1_url' => 'nullable|string|max:255',
            'button_2_text' => 'nullable|string|max:100',
            'button_2_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $imagePath = $request->file('image')->store('carousels', 'public');

        Carousel::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'button_1_text' => $validated['button_1_text'] ?? null,
            'button_1_url' => $validated['button_1_url'] ?? null,
            'button_2_text' => $validated['button_2_text'] ?? null,
            'button_2_url' => $validated['button_2_url'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('carousels.index')->with('success', 'Carousel created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Carousel $carousel)
    {
        return Inertia::render('Carousel/form', [
            'carousel' => $carousel,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carousel $carousel)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'button_1_text' => 'nullable|string|max:100',
            'button_1_url' => 'nullable|string|max:255',
            'button_2_text' => 'nullable|string|max:100',
            'button_2_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($carousel->image_path) {
                Storage::disk('public')->delete($carousel->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('carousels', 'public');
        }

        $carousel->update([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'],
            'description' => $validated['description'],
            'image_path' => $validated['image_path'] ?? $carousel->image_path,
            'button_1_text' => $validated['button_1_text'] ?? $carousel->button_1_text,
            'button_1_url' => $validated['button_1_url'] ?? $carousel->button_1_url,
            'button_2_text' => $validated['button_2_text'] ?? $carousel->button_2_text,
            'button_2_url' => $validated['button_2_url'] ?? $carousel->button_2_url,
            'sort_order' => $validated['sort_order'] ?? $carousel->sort_order,
            'is_active' => $validated['is_active'] ?? $carousel->is_active,
        ]);

        return redirect()->route('carousels.index')->with('success', 'Carousel updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carousel $carousel)
    {
        // Delete image
        if ($carousel->image_path) {
            Storage::disk('public')->delete($carousel->image_path);
        }

        $carousel->delete();

        return redirect()->route('carousels.index')->with('success', 'Carousel deleted successfully.');
    }
}

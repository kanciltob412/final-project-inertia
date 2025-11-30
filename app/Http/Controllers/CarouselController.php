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
            'title' => 'nullable|string|max:255',
            'title_link_url' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'fallback_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'button_1_text' => 'nullable|string|max:100',
            'button_1_url' => 'nullable|string|max:255',
            'button_2_text' => 'nullable|string|max:100',
            'button_2_url' => 'nullable|string|max:255',
            'media_type' => 'required|in:image,video',
            'video' => 'nullable|mimes:mp4,webm,ogg,mov,avi,mkv|max:512000',
            'youtube_url' => 'nullable|string|max:255',
            'autoplay_video' => 'nullable|boolean',
            'mute_video' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Convert empty strings to null
        $validated['title'] = empty($validated['title']) ? null : $validated['title'];
        $validated['title_link_url'] = empty($validated['title_link_url']) ? null : $validated['title_link_url'];
        $validated['subtitle'] = empty($validated['subtitle']) ? null : $validated['subtitle'];
        $validated['description'] = empty($validated['description']) ? null : $validated['description'];
        $validated['button_1_text'] = empty($validated['button_1_text']) ? null : $validated['button_1_text'];
        $validated['button_1_url'] = empty($validated['button_1_url']) ? null : $validated['button_1_url'];
        $validated['button_2_text'] = empty($validated['button_2_text']) ? null : $validated['button_2_text'];
        $validated['button_2_url'] = empty($validated['button_2_url']) ? null : $validated['button_2_url'];
        $validated['youtube_url'] = empty($validated['youtube_url']) ? null : $validated['youtube_url'];

        $imagePath = $request->file('image')->store('carousels', 'public');
        $fallbackImagePath = null;
        $videoPath = null;

        if ($request->hasFile('fallback_image')) {
            $fallbackImagePath = $request->file('fallback_image')->store('carousels', 'public');
        }

        if ($validated['media_type'] === 'video' && $request->hasFile('video')) {
            $videoPath = $request->file('video')->store('carousels/videos', 'public');
        }

        Carousel::create([
            'title' => $validated['title'],
            'title_link_url' => $validated['title_link_url'],
            'subtitle' => $validated['subtitle'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'fallback_image_path' => $fallbackImagePath,
            'button_1_text' => $validated['button_1_text'],
            'button_1_url' => $validated['button_1_url'],
            'button_2_text' => $validated['button_2_text'],
            'button_2_url' => $validated['button_2_url'],
            'media_type' => $validated['media_type'] ?? 'image',
            'video_path' => $videoPath,
            'youtube_url' => $validated['youtube_url'],
            'autoplay_video' => $validated['autoplay_video'] ?? false,
            'mute_video' => $validated['mute_video'] ?? true,
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
            'title' => 'nullable|string|max:255',
            'title_link_url' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'fallback_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp,bmp,tiff,ico|max:2048',
            'button_1_text' => 'nullable|string|max:100',
            'button_1_url' => 'nullable|string|max:255',
            'button_2_text' => 'nullable|string|max:100',
            'button_2_url' => 'nullable|string|max:255',
            'media_type' => 'required|in:image,video',
            'video' => 'nullable|mimes:mp4,webm,ogg,mov,avi,mkv|max:512000',
            'youtube_url' => 'nullable|string|max:255',
            'autoplay_video' => 'nullable|boolean',
            'mute_video' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Convert empty strings to null
        $validated['title'] = empty($validated['title']) ? null : $validated['title'];
        $validated['title_link_url'] = empty($validated['title_link_url']) ? null : $validated['title_link_url'];
        $validated['subtitle'] = empty($validated['subtitle']) ? null : $validated['subtitle'];
        $validated['description'] = empty($validated['description']) ? null : $validated['description'];
        $validated['button_1_text'] = empty($validated['button_1_text']) ? null : $validated['button_1_text'];
        $validated['button_1_url'] = empty($validated['button_1_url']) ? null : $validated['button_1_url'];
        $validated['button_2_text'] = empty($validated['button_2_text']) ? null : $validated['button_2_text'];
        $validated['button_2_url'] = empty($validated['button_2_url']) ? null : $validated['button_2_url'];
        $validated['youtube_url'] = empty($validated['youtube_url']) ? null : $validated['youtube_url'];

        $imagePath = $carousel->image_path;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($carousel->image_path) {
                Storage::disk('public')->delete($carousel->image_path);
            }
            $imagePath = $request->file('image')->store('carousels', 'public');
        }

        $fallbackImagePath = $carousel->fallback_image_path;
        if ($request->hasFile('fallback_image')) {
            // Delete old fallback image
            if ($carousel->fallback_image_path) {
                Storage::disk('public')->delete($carousel->fallback_image_path);
            }
            $fallbackImagePath = $request->file('fallback_image')->store('carousels', 'public');
        }

        $videoPath = $carousel->video_path;
        if ($request->hasFile('video')) {
            // Delete old video
            if ($carousel->video_path) {
                Storage::disk('public')->delete($carousel->video_path);
            }
            $videoPath = $request->file('video')->store('carousels/videos', 'public');
        }

        $carousel->update([
            'title' => $validated['title'],
            'title_link_url' => $validated['title_link_url'],
            'subtitle' => $validated['subtitle'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'fallback_image_path' => $fallbackImagePath,
            'button_1_text' => $validated['button_1_text'],
            'button_1_url' => $validated['button_1_url'],
            'button_2_text' => $validated['button_2_text'],
            'button_2_url' => $validated['button_2_url'],
            'media_type' => $validated['media_type'],
            'video_path' => $videoPath,
            'youtube_url' => $validated['youtube_url'],
            'autoplay_video' => (bool) $validated['autoplay_video'],
            'mute_video' => (bool) $validated['mute_video'],
            'sort_order' => $validated['sort_order'] ?? $carousel->sort_order,
            'is_active' => (bool) ($validated['is_active'] ?? $carousel->is_active),
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

        // Delete video
        if ($carousel->video_path) {
            Storage::disk('public')->delete($carousel->video_path);
        }

        $carousel->delete();

        return redirect()->route('carousels.index')->with('success', 'Carousel deleted successfully.');
    }
}

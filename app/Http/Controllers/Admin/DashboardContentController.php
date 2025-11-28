<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerDashboardContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardContentController extends Controller
{
    /**
     * Display all dashboard content.
     */
    public function index(): Response
    {
        $content = CustomerDashboardContent::orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/DashboardContent', [
            'content' => $content,
        ]);
    }

    /**
     * Store new content.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:banner,news,promotion,info',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|string',
            'link_url' => 'nullable|string',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('dashboard-content', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        // Remove the image key since we've converted it to image_url
        unset($validated['image']);

        CustomerDashboardContent::create($validated);

        return back()->with('success', 'Content added successfully');
    }

    /**
     * Update content.
     */
    public function update(Request $request, CustomerDashboardContent $dashboardContent)
    {
        $validated = $request->validate([
            'type' => 'required|in:banner,news,promotion,info',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|string',
            'link_url' => 'nullable|string',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('dashboard-content', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        // Remove the image key since we've converted it to image_url
        unset($validated['image']);

        $dashboardContent->update($validated);

        return back()->with('success', 'Content updated successfully');
    }

    /**
     * Delete content.
     */
    public function destroy(CustomerDashboardContent $dashboardContent)
    {
        $dashboardContent->delete();

        return back()->with('success', 'Content deleted successfully');
    }
}

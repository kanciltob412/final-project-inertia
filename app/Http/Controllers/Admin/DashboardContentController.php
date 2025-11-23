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
            'image_url' => 'nullable|string',
            'link_url' => 'nullable|string',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ]);

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
            'image_url' => 'nullable|string',
            'link_url' => 'nullable|string',
            'content' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ]);

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

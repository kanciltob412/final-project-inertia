<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberPromo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMemberPromoController extends Controller
{
    public function index()
    {
        $promos = MemberPromo::orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/MemberPromo/Index', [
            'promos' => $promos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/MemberPromo/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:news,banner,promotion',
            'image_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'display_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        MemberPromo::create($validated);

        return redirect()->route('admin.member-promos.index')->with('success', 'Promo created successfully.');
    }

    public function edit(MemberPromo $memberPromo)
    {
        return Inertia::render('Admin/MemberPromo/Edit', [
            'promo' => $memberPromo,
        ]);
    }

    public function update(Request $request, MemberPromo $memberPromo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:news,banner,promotion',
            'image_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'display_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $memberPromo->update($validated);

        return redirect()->route('admin.member-promos.index')->with('success', 'Promo updated successfully.');
    }

    public function destroy(MemberPromo $memberPromo)
    {
        $memberPromo->delete();

        return redirect()->route('admin.member-promos.index')->with('success', 'Promo deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        MemberPromo::whereIn('id', $ids)->delete();

        return redirect()->route('admin.member-promos.index')->with('success', 'Promos deleted successfully.');
    }
}

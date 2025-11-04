<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('User/index');
    }

    public function show(string $id)
    {
        return Inertia::render('User/show', [
            'id' => $id,
        ]);
    }
}

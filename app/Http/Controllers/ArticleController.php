<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $article = new Article();
        $article->name = $request->name;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $article->image_path = $path; // e.g., "images/example.jpg"
        }

        $article->save();

        return redirect()->back()->with('success', 'Article added successfully.');
    }
}

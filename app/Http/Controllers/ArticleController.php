<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return Inertia::render('Settings/Settings', [
            'articles' => $articles,
        ]);
    }
    public function create()
    {
        return Inertia::render('Settings/AddArticle');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:female,male,home',
            'image' => 'nullable|image|max:2048', // Max 2MB
            'description' => 'string',
        ]);

        $article = new Article();
        $article->name = $request->name;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $article->image = $path; // e.g., "images/example.jpg"
        }

        $article->save();

        return redirect()->back()->with('success', 'Article added successfully.');
    }
    public function edit(Article $article)
    {
        $articles = Article::all();
        return Inertia::render('Settings/Showarticles', [
            'article' => $article,
        ]);
    }
    public function update(Request $request, Article $article)
    {
        return '';
    }
}
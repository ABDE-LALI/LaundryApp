<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleService;
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
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:female,male,home',
            'image' => 'nullable|image|max:2048', // Max 2MB
            'description' => 'string',
            'ironPrice' => 'required|numeric',
            'washPrice' => 'required|numeric',
            'dryPrice' => 'required|numeric',
            'paintPrice' => 'required|numeric',
        ]);
        $prices = [
            'washPrice' => $request->washPrice,
            'dryPrice' => $request->dryPrice,
            'ironPrice' => $request->ironPrice,
            'paintPrice' => $request->paintPrice,
        ];
        $article = new Article();
        $article->name = $request->name;        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $article->image = $path; // e.g., "images/example.jpg"
        }

        $article->save();
        $i = 1;
        foreach ($prices as $price) {
            $ArticleService = new ArticleService();
            $ArticleService->article_id = $article->id;
            $ArticleService->service_id = $i++;
            $ArticleService->price = $price;
            $ArticleService->save();
        };

        return redirect()->back()->with('success', 'Article added successfully.');
    }
    public function edit(Article $article)
    {
        $articles = Article::all();
        return Inertia::render('Settings/Showarticles', [
            'article' => $article,
        ]);
    }
    public function update(Request $request)
    {
        // Validate incoming form data

        $request->validate([
            'id' => 'required|exists:articles,id', // Ensure the ID exists
            'name' => 'required|string|max:255',
            'gender' => 'required|in:female,male,home',
            'image' => 'nullable|image|max:2048', // Max 2MB
            'description' => 'nullable|string',
            'ironPrice' => 'required|numeric',
            'washPrice' => 'required|numeric',
            'dryPrice' => 'required|numeric',
            'paintPrice' => 'required|numeric',
        ]);

        // Find the article or fail
        $article = Article::findOrFail($request->id);

        // Update fields
        $article->name = $request->name;
        $article->description = $request->description;
        $article->gender = $request->gender;

        // Handle file upload (if exists)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $article->image = $path;
        }

        // Save the updated article
        $article->save();
        $articleService = ArticleService::where('article_id', $article->id)->where('service_id', 1)->first();
        $articleService->price = $request->ironPrice;
        $articleService->save();
        $articleService = ArticleService::where('article_id', $article->id)->where('service_id', 2)->first();
        $articleService->price = $request->washPrice;
        $articleService->save();
        $articleService = ArticleService::where('article_id', $article->id)->where('service_id', 3)->first();
        $articleService->price = $request->dryPrice;
        $articleService->save();
        $articleService = ArticleService::where('article_id', $article->id)->where('service_id', 4)->first();
        $articleService->price = $request->paintPrice;
        $articleService->save();

        return redirect()->back()->with('success', 'Article updated successfully.');
    }
    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->back()->with('success', 'Article deleted successfully.');
    }
}

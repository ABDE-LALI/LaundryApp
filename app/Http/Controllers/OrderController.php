<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Service;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // Determine the database connection based on environment or request
        $connection = config('database.default'); // 'sqlite' for offline, 'mysql' for online
        // Optionally, check if running in Electron offline mode (custom logic needed)
        // For now, assume dynamic switching isn't implemented yet; adjust based on your setup

        $articles = Article::on($connection)->with('services')->get();
        $services = Service::on($connection)->get();

        return Inertia::render('Serve/Create', [
            'articles' => $articles,
            'services' => $services,
        ]);
    }
}

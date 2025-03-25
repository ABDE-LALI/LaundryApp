<?php

namespace App\Http\Controllers;

use App\Models\ArticleService;
use Illuminate\Http\Request;

class ServiceArticleController extends Controller
{
    public function getPrice($article_id, $service_id)
    {
        try {
            // Fetch the price from the ArticleService model
            $articleService = ArticleService::where('article_id', $article_id)
                ->where('service_id', $service_id)
                ->first();
    
            // Check if the record exists
            if (!$articleService) {
                return response()->json([
                    'error' => 'Price not found for the given article and service combination.',
                ], 404);
            }
    
            // Return the price as a JSON response
            return response()->json([
                'price' => $articleService->price,
            ], 200);
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'error' => 'An error occurred while fetching the price.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
}

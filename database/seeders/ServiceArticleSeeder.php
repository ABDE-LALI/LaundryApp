<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch all articles and services
        $articles = Article::all();
        $services = Service::all();

        $articleServiceData = [];

        foreach ($articles as $article) {
            foreach ($services as $service) {
                // Determine the price based on the article's gender and service type
                $price = $this->determinePrice($article, $service);

                $articleServiceData[] = [
                    'article_id' => $article->id,
                    'service_id' => $service->id,
                    'price' => $price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Bulk insert into article_services table
        DB::table('article_services')->insert($articleServiceData);
    }

    private function determinePrice($article, $service): int
    {
        $isHomeArticle = $article->gender === 'home';

        // Define prices based on service name and article type
        switch ($service->name) {
            case 'Lavage normal':
                return $isHomeArticle ? 50 : 30;
            case 'Lavage à sec':
                return $isHomeArticle ? 70 : 50;
            case 'Repassage':
                return $isHomeArticle ? 30 : 20;
            case 'Teinture de vêtements':
                return $isHomeArticle ? 60 : 40;
            default:
                return 0; // Fallback price (shouldn't happen)
        }
    }
}
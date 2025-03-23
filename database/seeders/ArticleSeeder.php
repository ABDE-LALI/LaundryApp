<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run()
    {
        // Male articles (32 after removing duplicate selham)
        $maleArticles = array_unique([
            'selham',
            'pijama',
            'espadrille',
            'jabador',
            'cravate',
            'pull',
            'cagoul',
            'cashcoule',
            'blouse-infirmier',
            'casket',
            'jacket-bomber',
            'jacket',
            'jacket-cuir',
            'monto',
            'debardeur',
            'servit',
            'serwal-toub',
            'serwal-atwal',
            'short',
            'short-cargo',
            'jellaba',
            'foukiya',
            'gandora',
            'jilet-formel',
            'chemise',
            'veste',
            'costume',
            't-shirt',
            'jacket-jeans',
            'pantalon-cargo',
            'pantalon-jeans',
            'hoodie',
        ]);

        // Female articles (9 new articles)
        $femaleArticles = [
            'jellaba-f',
            'chale',
            'takchita',
            'robe',
            'folard',
            'jupe-court',
            'jupe-long',
            'kaftan',
            'ensemble',
        ];
        $homeArticles = [
            'tlamet',
            'sac-camp',
            'sac-dos',
            'sac-voyage',
            'sac-main',
            'serviette-main',
            'serviette-bain',
            'tapis-normal',
            'housse-coussin',
            'sellaya',
            'nappe',
            'rideau',
            'couverture',
            'couette',
            'couverture-enfant',
            'drap',
            'orreiller',
        ];

        // Prepare male articles data
        $maleArticlesData = array_map(function ($name) {
            return [
                'name' => $name,
                'image' => 'images/articles/' . $name . '.jpg',
                'gender' => 'male',
                'description' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $maleArticles);

        // Prepare female articles data
        $femaleArticlesData = array_map(function ($name) {
            return [
                'name' => $name,
                'image' => 'images/articles/' . $name . '.jpg',
                'gender' => 'female',
                'description' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $femaleArticles);
        $homeArticlesData = array_map(function ($name) {
            return [
                'name' => $name,
                'image' => 'images/articles/' . $name . '.jpg',
                'gender' => 'home',
                'description' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $homeArticles);

        // Combine both arrays
        $allArticlesData = array_merge($maleArticlesData, $femaleArticlesData, $homeArticlesData);

        // Bulk insert all articles
        Article::insert($allArticlesData);
    }
}
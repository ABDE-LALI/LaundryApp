<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $articles = [
            [
                'name' => 'Cotton T-Shirt',
                'image' => 'images/tshirt.jpg',
                'description' => 'Comfortable cotton t-shirt suitable for everyday wear',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Denim Jeans',
                'image' => 'images/jeans.jpg',
                'description' => 'Classic blue denim jeans with a modern fit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Wool Sweater',
                'image' => 'images/sweater.jpg',
                'description' => 'Warm wool sweater perfect for cold weather',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Insert the sample data into the articles table
        DB::table('articles')->insert($articles);
    }
}
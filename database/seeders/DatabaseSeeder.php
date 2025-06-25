<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(ArticleSeeder::class);
        $this->call(ServiceSeeder::class);
        User::create([
            'firstname' => 'Test User',
            'lastname' => 'last',
            'is_admin' => true,
            'phone1' => '0123456789',
            'phone2' => '0987654321',
            'password' => '12341234', // Use bcrypt for password hashing
            'remember_token' => 'hello',
        ]);
        $this->call(ServiceArticleSeeder::class);
    }
}

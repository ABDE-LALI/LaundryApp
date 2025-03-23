<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $services = [
            [
                'image' => 'images/services/washing.png',
                'name' => 'Lavage normal',
                'description' => 'Lavage professionnel pour tous types de vêtements',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/services/dry.png',
                'name' => 'Lavage à sec',
                'description' => 'Nettoyage à sec pour les tissus délicats',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/services/iron.png',
                'name' => 'Repassage',
                'description' => 'Repassage soigné pour un look impeccable',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/services/paint.png',
                'name' => 'Teinture de vêtements',
                'description' => 'Teinture pour redonner de la couleur à vos vêtements',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Insert the sample data into the services table
        DB::table('services')->insert($services);
    }
}
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
                'image' => 'images/washing.jpg',
                'name' => 'Washing Service',
                'description' => 'Professional washing for all types of garments',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/drycleaning.jpg',
                'name' => 'Dry Cleaning',
                'description' => 'Expert dry cleaning for delicate fabrics',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/ironing.jpg',
                'name' => 'Ironing Service',
                'description' => 'Crisp ironing for a polished look',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'image' => 'images/repairs.jpg',
                'name' => 'Clothing Repair',
                'description' => 'Mending and alterations for your garments',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Insert the sample data into the services table
        DB::table('services')->insert($services);
    }
}
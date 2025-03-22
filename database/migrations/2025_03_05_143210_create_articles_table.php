<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->enum('gender', ['female', 'male', 'home'])->default('male');
            $table->string('description')->nullable();
            // $table->integer('p_wash'); 
            // $table->integer('p_dry')->nullable();
            // $table->integer('p_wash_iron')->nullable();
            // $table->integer('p_dry_iron')->nullable();
            // $table->integer('p_iron')->nullable();
            // $table->integer('p_paint_black')->nullable();
            // $table->integer('p_paint_color')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

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
        Schema::create('tickets', function (Blueprint $table) {
            // $table->foreignId('cusromer_id')->nullable();
            // $table->string('customer_name')->nullable();
            // $table->string('customer_email')->nullable();
            // $table->string('customer_phone')->nullable();
            // $table->string('customer_address')->nullable();
            $table->id();
            $table->integer('total_price');
            $table->integer('quantity');
            $table->enum('payment_status', ['paid', 'unpaid', 'paid_some'])->default('unpaid');
            $table->decimal('paid_amount')->default(0);
            $table->enum('status', ['received', 'delivered'])->default('received');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

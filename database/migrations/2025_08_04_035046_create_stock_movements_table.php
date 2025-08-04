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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('user_id')->constrained('users');
            $table->enum('type', ['in', 'out', 'adjustment', 'expired', 'damaged']);
            $table->integer('quantity'); // Bisa negative untuk out
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->string('reference_type')->nullable(); // 'sale', 'purchase', 'adjustment'
            $table->unsignedBigInteger('reference_id')->nullable(); // ID dari tabel referensi
            $table->text('notes')->nullable();
            $table->timestamp('movement_date');
            $table->string('user_role')->nullable(); // Track role saat movement
            $table->json('user_permissions')->nullable(); // Track permissions saat movement (untuk audit)
            $table->timestamps();

            // Indexes
            $table->index(['product_id', 'movement_date']);
            $table->index(['type', 'movement_date']);
            $table->index('user_id'); // Untuk audit trail
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};

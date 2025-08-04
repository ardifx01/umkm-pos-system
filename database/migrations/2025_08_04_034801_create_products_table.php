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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('sku')->unique()->nullable(); // Perbaikan: unique constraint
            $table->decimal('purchase_price', 12, 2); // Perbaikan: precision ditingkatkan
            $table->decimal('selling_price', 12, 2);
            $table->integer('stock')->default(0);
            $table->string('unit', 10)->default('pcs');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('category_id')->nullable()->constrained('categories'); // Perbaikan: foreign key
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers'); // Tambahan: supplier relation
            $table->string('image')->nullable();
            $table->integer('min_stock')->default(0);
            $table->integer('max_stock')->nullable(); // Tambahan: max stock untuk reorder point
            $table->boolean('is_perishable')->default(false);
            $table->date('expired_date')->nullable();
            $table->integer('preparation_time')->default(0);
            $table->decimal('weight', 8, 3)->nullable(); // Tambahan: untuk produk yang dijual per weight
            $table->timestamps();
            $table->softDeletes();

            // Indexes untuk performance
            $table->index(['is_active', 'category_id']);
            $table->index('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

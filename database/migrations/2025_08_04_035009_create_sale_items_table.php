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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products'); // Perbaikan: tidak cascade delete
            $table->string('product_name'); // Tambahan: snapshot nama produk
            $table->string('product_sku')->nullable(); // Tambahan: snapshot SKU
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2); // Perbaikan: rename dari 'price'
            $table->decimal('discount_amount', 10, 2)->default(0); // Tambahan: discount per item
            $table->decimal('subtotal', 12, 2);
            $table->text('notes')->nullable(); // Tambahan: catatan khusus item
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};

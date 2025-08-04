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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // Tambahan: nomor invoice
            $table->foreignId('user_id')->constrained('users'); // Perbaikan: remove cascade delete
            $table->dateTime('sale_date');
            $table->decimal('subtotal', 12, 2); // Tambahan: subtotal sebelum tax & discount
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('cash_received', 12, 2)->nullable(); // Perbaikan: nullable untuk non-cash
            $table->decimal('change_returned', 12, 2)->default(0);
            $table->text('note')->nullable(); // Perbaikan: text instead of string
            $table->foreignId('customer_id')->nullable()->constrained('customers'); // Perbaikan: foreign key
            $table->enum('payment_method', ['cash', 'card', 'digital', 'bank_transfer'])->default('cash');
            $table->enum('status', ['draft', 'pending', 'completed', 'cancelled', 'refunded'])->default('completed');
            $table->string('table_number')->nullable();
            $table->enum('order_type', ['dine-in', 'takeaway', 'delivery'])->default('dine-in');
            $table->timestamp('completed_at')->nullable(); // Tambahan: tracking completion time
            $table->timestamps();

            // Indexes untuk performance
            $table->index(['sale_date', 'status']);
            $table->index('invoice_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};

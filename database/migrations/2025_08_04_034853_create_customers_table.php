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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 15)->unique(); // Perbaikan: string dan unique
            $table->string('email')->unique()->nullable(); // Perbaikan: unique constraint
            $table->text('address')->nullable(); // Perbaikan: typo dan tipe data
            $table->date('birth_date')->nullable(); // Tambahan: untuk program loyalty
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->decimal('total_spent', 12, 2)->default(0); // Tambahan: tracking spending
            $table->integer('visit_count')->default(0); // Tambahan: tracking visits
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            PaymentMethodSeeder::class,
            TaxSeeder::class,
            CategorySeeder::class,
            SettingSeeder::class,
            UserSeeder::class, // Buat seeder ini untuk user default
            SupplierSeeder::class,
        ]);
    }
}
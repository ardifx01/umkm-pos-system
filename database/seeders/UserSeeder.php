<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Owner/Admin
        $owner = User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@postoko.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $owner->assignRole('owner');

        // Create Manager
        $manager = User::create([
            'name' => 'Manager Toko',
            'email' => 'manager@postoko.com', 
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $manager->assignRole('manager');

        // Create Cashier
        $cashier = User::create([
            'name' => 'Kasir Satu',
            'email' => 'kasir@postoko.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $cashier->assignRole('cashier');

        // Create Warehouse Staff
        $warehouse = User::create([
            'name' => 'Staff Gudang',
            'email' => 'gudang@postoko.com',
            'phone' => '081234567893',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $warehouse->assignRole('warehouse');
    }
}
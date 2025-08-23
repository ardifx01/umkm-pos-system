<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Owner
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@umkmstore.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        
        $owner->assignRole('owner');

        // Create Manager
        $manager = User::create([
            'name' => 'Manager',
            'email' => 'manager@umkmstore.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $manager->assignRole('manager');

        // Create Cashier
        $cashier = User::create([
            'name' => 'Cashier',
            'email' => 'cashier@umkmstore.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        $cashier->assignRole('cashier');
    }
}
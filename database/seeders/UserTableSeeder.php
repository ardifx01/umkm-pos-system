<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::where('name', 'owner')->first();

        $ownerUser = User::create([
            'name' => 'Septian',
            'email' => 'septian@dev.com',
            'password' => bcrypt('password'),
            'phone' => '089663002695', 
        ]);

        $ownerUser->assignRole($role);

        $cashierUser = User::create([
            'name' => 'Kasir 1',
            'email' => 'kasir1@pos.com',
            'password' => bcrypt('password'),
            'phone' => '089663002693',
        ]);

        $cashierUser->assignRole('cashier');

    }
}
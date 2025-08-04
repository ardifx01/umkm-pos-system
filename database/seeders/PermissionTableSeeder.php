<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'dashboard-access', 'dashboard-data',
            // Products
            'products-access', 'products-data', 'products-create', 'products-update', 'products-delete',
            // Sales
            'sales-access', 'sales-data', 'sales-create', 'sales-update', 'sales-delete',
            // Permissions
            'permissions-access', 'permissions-data', 'permissions-create', 'permissions-update', 'permissions-delete',
            // Roles
            'roles-access', 'roles-data', 'roles-create', 'roles-update', 'roles-delete',
            // Users
            'users-access', 'users-data', 'users-create', 'users-update', 'users-delete',
        ])->each(fn($item) => Permission::create(['name' => $item]));
    }
}
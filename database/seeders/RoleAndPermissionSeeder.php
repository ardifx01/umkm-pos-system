<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User Management
            'manage users',
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Product Management
            'manage products',
            'view products',
            'create products',
            'edit products',
            'delete products',

            // Stock Movement Management
            'manage stock movements',    // untuk owner - full access
            'view stock movements',      // untuk semua role yang bisa lihat
            'create stock movements',    // untuk create/store
            'edit stock movements',      // untuk update notes saja
            'delete stock movements',    // untuk destroy

            // Sales Management
            'manage sales',
            'view sales',
            'create sales',
            'process refunds',
            'view sales reports',
            
            // Purchase Management
            'manage purchases',
            'view purchases',
            'create purchases',
            'receive purchases',
            
            // Cash Register
            'manage cash register',
            'open cash register',
            'close cash register',
            'view cash register',
            
            // Customer Management
            'manage customers',
            'view customers',
            'create customers',
            'edit customers',
            
            // Supplier Management
            'manage suppliers',
            'view suppliers',
            'create suppliers',
            'edit suppliers',
            
            // Reports
            'view reports',
            'export reports',
            'view financial reports',
            'view inventory reports',
            
            // Settings
            'manage settings',
            'view settings',
            
            // Categories & Taxes
            'manage taxes',         // untuk owner - full access
            'view taxes',          // untuk semua role yang bisa lihat
            'create taxes',        // untuk create/store
            'edit taxes',          // untuk update
            'delete taxes',        // untuk destroy/soft delete
            'restore taxes',       // untuk restore soft deleted taxes

        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $owner = Role::create(['name' => 'owner']);
        $owner->givePermissionTo(Permission::all());

        $manager = Role::create(['name' => 'manager']);
        $manager->givePermissionTo([
            'manage products', 'view products', 'create products', 'edit products',
            'manage inventory', 'view inventory', 'adjust stock', 'view stock movements',
            'manage sales', 'view sales', 'create sales', 'process refunds', 'view sales reports',
            'manage purchases', 'view purchases', 'create purchases', 'receive purchases',
            'manage cash register', 'open cash register', 'close cash register', 'view cash register',
            'manage customers', 'view customers', 'create customers', 'edit customers',
            'manage suppliers', 'view suppliers', 'create suppliers', 'edit suppliers',
            'view reports', 'export reports', 'view financial reports', 'view inventory reports',
            'manage categories', 'manage taxes', 'manage payment methods', 'view taxes',
        ]);

        $cashier = Role::create(['name' => 'cashier']);
        $cashier->givePermissionTo([
            'view products',
            'view inventory',
            'create sales', 'view sales',
            'open cash register', 'close cash register', 'view cash register',
            'view customers', 'create customers',
        ]);
    }
}
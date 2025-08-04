<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions untuk sistem POS UMKM
        $permissions = [
            // User Management
            'view users', 'create users', 'edit users', 'delete users',
            
            // Product Management
            'view products', 'create products', 'edit products', 'delete products',
            'manage stock', 'view low stock alerts',
            
            // Category Management
            'view categories', 'create categories', 'edit categories', 'delete categories',
            
            // Sales Management
            'create sales', 'view sales', 'edit sales', 'delete sales',
            'process refunds', 'apply discounts',
            
            // Customer Management
            'view customers', 'create customers', 'edit customers', 'delete customers',
            
            // Supplier Management
            'view suppliers', 'create suppliers', 'edit suppliers', 'delete suppliers',
            
            // Purchase Management
            'view purchases', 'create purchases', 'edit purchases', 'delete purchases',
            'receive stock',
            
            // Reports
            'view sales reports', 'view inventory reports', 'view customer reports',
            'view financial reports', 'export reports',
            
            // Settings
            'manage settings', 'backup data', 'manage payment methods',
            
            // Advanced Features
            'manage promotions', 'bulk operations', 'data import/export',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles dan assign permissions
        
        // 1. OWNER/ADMIN - Full access
        $owner = Role::create(['name' => 'owner']);
        $owner->givePermissionTo(Permission::all());

        // 2. MANAGER - Hampir semua akses kecuali user management
        $manager = Role::create(['name' => 'manager']);
        $manager->givePermissionTo([
            'view products', 'create products', 'edit products', 'manage stock',
            'view low stock alerts', 'view categories', 'create categories', 'edit categories',
            'create sales', 'view sales', 'edit sales', 'process refunds', 'apply discounts',
            'view customers', 'create customers', 'edit customers',
            'view suppliers', 'create suppliers', 'edit suppliers',
            'view purchases', 'create purchases', 'edit purchases', 'receive stock',
            'view sales reports', 'view inventory reports', 'view customer reports',
            'view financial reports', 'export reports',
            'manage payment methods', 'manage promotions',
        ]);

        // 3. CASHIER - Fokus pada penjualan dan customer service
        $cashier = Role::create(['name' => 'cashier']);
        $cashier->givePermissionTo([
            'view products', 'view categories', 'view low stock alerts',
            'create sales', 'view sales', 'apply discounts',
            'view customers', 'create customers', 'edit customers',
            'view sales reports',
        ]);

        // 4. WAREHOUSE - Fokus pada inventory dan supplier
        $warehouse = Role::create(['name' => 'warehouse']);
        $warehouse->givePermissionTo([
            'view products', 'create products', 'edit products', 'manage stock',
            'view low stock alerts', 'view categories', 'create categories', 'edit categories',
            'view suppliers', 'create suppliers', 'edit suppliers',
            'view purchases', 'create purchases', 'edit purchases', 'receive stock',
            'view inventory reports', 'export reports',
        ]);
    }
}
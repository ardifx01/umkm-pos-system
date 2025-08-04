<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Makanan & Minuman',
                'description' => 'Produk makanan dan minuman siap saji',
                'color' => '#EF4444',
                'is_active' => true,
            ],
            [
                'name' => 'Snack & Cemilan',
                'description' => 'Berbagai jenis snack dan cemilan',
                'color' => '#F59E0B',
                'is_active' => true,
            ],
            [
                'name' => 'Minuman Dingin',
                'description' => 'Minuman dingin dan es',
                'color' => '#3B82F6',
                'is_active' => true,  
            ],
            [
                'name' => 'Minuman Panas',
                'description' => 'Kopi, teh, dan minuman panas lainnya',
                'color' => '#8B5CF6',
                'is_active' => true,
            ],
            [
                'name' => 'Kebutuhan Harian',
                'description' => 'Produk kebutuhan sehari-hari',
                'color' => '#10B981',
                'is_active' => true,
            ],
            [
                'name' => 'Frozen Food',
                'description' => 'Makanan beku dan frozen',
                'color' => '#06B6D4',
                'is_active' => true,
            ],
            [
                'name' => 'Peralatan',
                'description' => 'Peralatan dan aksesoris',
                'color' => '#6B7280',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
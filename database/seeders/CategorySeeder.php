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
                'name' => 'Food & Beverages',
                'description' => 'Makanan dan minuman',
                'color' => '#28a745',
                'is_active' => true,
            ],
            [
                'name' => 'Electronics',
                'description' => 'Peralatan elektronik',
                'color' => '#007bff',
                'is_active' => true,
            ],
            [
                'name' => 'Clothing',
                'description' => 'Pakaian dan aksesoris',
                'color' => '#e83e8c',
                'is_active' => true,
            ],
            [
                'name' => 'Health & Beauty',
                'description' => 'Kesehatan dan kecantikan',
                'color' => '#20c997',
                'is_active' => true,
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Rumah dan taman',
                'color' => '#fd7e14',
                'is_active' => true,
            ],
            [
                'name' => 'Sports & Outdoor',
                'description' => 'Olahraga dan outdoor',
                'color' => '#6f42c1',
                'is_active' => true,
            ],
            [
                'name' => 'Books & Stationery',
                'description' => 'Buku dan alat tulis',
                'color' => '#17a2b8',
                'is_active' => true,
            ],
            [
                'name' => 'Others',
                'description' => 'Lainnya',
                'color' => '#6c757d',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
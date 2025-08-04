<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\User;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'admin@postoko.com')->first();
        $categories = Category::all();
        $suppliers = Supplier::all();

        $products = [
            // Makanan & Minuman
            [
                'name' => 'Nasi Gudeg Yogya',
                'sku' => 'F001',
                'purchase_price' => 8000,
                'selling_price' => 15000,
                'stock' => 25,
                'unit' => 'porsi',
                'description' => 'Nasi gudeg khas Yogyakarta dengan ayam dan telur',
                'category_name' => 'Makanan & Minuman',
                'supplier_name' => 'CV Sumber Rejeki',
                'min_stock' => 5,
                'max_stock' => 50,
                'preparation_time' => 15,
            ],
            [
                'name' => 'Ayam Geprek Sambal Matah',
                'sku' => 'F002', 
                'purchase_price' => 10000,
                'selling_price' => 18000,
                'stock' => 30,
                'unit' => 'porsi',
                'description' => 'Ayam geprek dengan sambal matah pedas',
                'category_name' => 'Makanan & Minuman',
                'supplier_name' => 'UD Maju Bersama',
                'min_stock' => 5,
                'max_stock' => 60,
                'preparation_time' => 20,
            ],
            [
                'name' => 'Mie Ayam Spesial',
                'sku' => 'F003',
                'purchase_price' => 6000,
                'selling_price' => 12000,
                'stock' => 40,
                'unit' => 'porsi',
                'description' => 'Mie ayam dengan pangsit dan bakso',
                'category_name' => 'Makanan & Minuman',
                'supplier_name' => 'CV Sumber Rejeki',
                'min_stock' => 10,
                'max_stock' => 80,
                'preparation_time' => 10,
            ],
            
            // Snack & Cemilan
            [
                'name' => 'Keripik Singkong Original',
                'sku' => 'S001',
                'purchase_price' => 3000,
                'selling_price' => 5000,
                'stock' => 50,
                'unit' => 'pack',
                'description' => 'Keripik singkong renyah original',
                'category_name' => 'Snack & Cemilan',
                'supplier_name' => 'Toko Grosir Harapan',
                'min_stock' => 15,
                'max_stock' => 100,
            ],
            [
                'name' => 'Kerupuk Udang Sidoarjo',
                'sku' => 'S002',
                'purchase_price' => 4000,
                'selling_price' => 7000,
                'stock' => 35,
                'unit' => 'pack',
                'description' => 'Kerupuk udang asli Sidoarjo',
                'category_name' => 'Snack & Cemilan',
                'supplier_name' => 'UD Maju Bersama',
                'min_stock' => 10,
                'max_stock' => 70,
            ],
            [
                'name' => 'Chitato Rasa Sapi Panggang',
                'sku' => 'S003',
                'purchase_price' => 8000,
                'selling_price' => 12000,
                'stock' => 60,
                'unit' => 'pack',
                'description' => 'Keripik kentang rasa sapi panggang',
                'category_name' => 'Snack & Cemilan',
                'supplier_name' => 'PT Indofood Sukses Makmur',
                'min_stock' => 20,
                'max_stock' => 120,
            ],
            
            // Minuman Dingin
            [
                'name' => 'Es Teh Manis',
                'sku' => 'D001',
                'purchase_price' => 2000,
                'selling_price' => 5000,
                'stock' => 100,
                'unit' => 'gelas',
                'description' => 'Es teh manis segar',
                'category_name' => 'Minuman Dingin',
                'supplier_name' => 'CV Sumber Rejeki',
                'min_stock' => 25,
                'max_stock' => 200,
                'preparation_time' => 3,
            ],
            [
                'name' => 'Es Jeruk Nipis',
                'sku' => 'D002',
                'purchase_price' => 3000,
                'selling_price' => 7000,
                'stock' => 80,
                'unit' => 'gelas',
                'description' => 'Es jeruk nipis segar dengan gula',
                'category_name' => 'Minuman Dingin',
                'supplier_name' => 'UD Maju Bersama',
                'min_stock' => 20,
                'max_stock' => 150,
                'preparation_time' => 5,
            ],
            [
                'name' => 'Coca Cola 330ml',
                'sku' => 'D003',
                'purchase_price' => 4000,
                'selling_price' => 7000,
                'stock' => 120,
                'unit' => 'botol',
                'description' => 'Coca Cola kaleng 330ml',
                'category_name' => 'Minuman Dingin',
                'supplier_name' => 'Toko Grosir Harapan',
                'min_stock' => 30,
                'max_stock' => 200,
            ],
            
            // Minuman Panas
            [
                'name' => 'Kopi Hitam Robusta',
                'sku' => 'H001',
                'purchase_price' => 2500,
                'selling_price' => 6000,
                'stock' => 80,
                'unit' => 'cangkir',
                'description' => 'Kopi hitam robusta asli',
                'category_name' => 'Minuman Panas',
                'supplier_name' => 'CV Sumber Rejeki',
                'min_stock' => 20,
                'max_stock' => 150,
                'preparation_time' => 5,
            ],
            [
                'name' => 'Teh Panas Jasmine',
                'sku' => 'H002',
                'purchase_price' => 1500,
                'selling_price' => 4000,
                'stock' => 90,
                'unit' => 'cangkir',
                'description' => 'Teh jasmine hangat',
                'category_name' => 'Minuman Panas',
                'supplier_name' => 'UD Maju Bersama',
                'min_stock' => 25,
                'max_stock' => 180,
                'preparation_time' => 3,
            ],
            
            // Kebutuhan Harian
            [
                'name' => 'Beras Premium 5kg',
                'sku' => 'N001',
                'purchase_price' => 55000,
                'selling_price' => 70000,
                'stock' => 20,
                'unit' => 'kg',
                'description' => 'Beras premium kualitas terbaik',
                'category_name' => 'Kebutuhan Harian',
                'supplier_name' => 'Toko Grosir Harapan',
                'min_stock' => 5,
                'max_stock' => 50,
                'weight' => 5.0,
            ],
            [
                'name' => 'Minyak Goreng Tropical 2L',
                'sku' => 'N002',
                'purchase_price' => 28000,
                'selling_price' => 35000,
                'stock' => 25,
                'unit' => 'botol',
                'description' => 'Minyak goreng Tropical 2 liter',
                'category_name' => 'Kebutuhan Harian',
                'supplier_name' => 'PT Indofood Sukses Makmur',
                'min_stock' => 8,
                'max_stock' => 60,
                'weight' => 2.0,
            ],
            [
                'name' => 'Gula Pasir Gulaku 1kg',
                'sku' => 'N003',
                'purchase_price' => 12000,
                'selling_price' => 16000,
                'stock' => 30,
                'unit' => 'kg',
                'description' => 'Gula pasir putih Gulaku 1kg',
                'category_name' => 'Kebutuhan Harian',
                'supplier_name' => 'Toko Grosir Harapan',
                'min_stock' => 10,
                'max_stock' => 80,
                'weight' => 1.0,
            ],
            
            // Frozen Food
            [
                'name' => 'Nugget Ayam Fiesta 500g',
                'sku' => 'FF001',
                'purchase_price' => 18000,
                'selling_price' => 25000,
                'stock' => 15,
                'unit' => 'pack',
                'description' => 'Nugget ayam Fiesta frozen 500g',
                'category_name' => 'Frozen Food',
                'supplier_name' => 'PT Nestle Indonesia',
                'min_stock' => 5,
                'max_stock' => 40,
                'is_perishable' => true,
                'expired_date' => now()->addMonths(6),
                'weight' => 0.5,
            ],
            [
                'name' => 'Sosis Ayam Bernardi 375g',
                'sku' => 'FF002',
                'purchase_price' => 15000,
                'selling_price' => 22000,
                'stock' => 18,
                'unit' => 'pack',
                'description' => 'Sosis ayam Bernardi frozen 375g',
                'category_name' => 'Frozen Food',
                'supplier_name' => 'CV Sumber Rejeki',
                'min_stock' => 6,
                'max_stock' => 50,
                'is_perishable' => true,
                'expired_date' => now()->addMonths(4),
                'weight' => 0.375,
            ],
        ];

        foreach ($products as $productData) {
            $category = $categories->where('name', $productData['category_name'])->first();
            $supplier = $suppliers->where('name', $productData['supplier_name'])->first();
            
            Product::create([
                'user_id' => $owner->id,
                'name' => $productData['name'],
                'sku' => $productData['sku'],
                'purchase_price' => $productData['purchase_price'],
                'selling_price' => $productData['selling_price'],
                'stock' => $productData['stock'],
                'unit' => $productData['unit'],
                'description' => $productData['description'],
                'is_active' => true,
                'category_id' => $category?->id,
                'supplier_id' => $supplier?->id,
                'min_stock' => $productData['min_stock'],
                'max_stock' => $productData['max_stock'] ?? null,
                'is_perishable' => $productData['is_perishable'] ?? false,
                'expired_date' => $productData['expired_date'] ?? null,
                'preparation_time' => $productData['preparation_time'] ?? 0,
                'weight' => $productData['weight'] ?? null,
            ]);
        }
    }
}
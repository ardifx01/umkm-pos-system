<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $categories = Category::all();
        $suppliers = Supplier::all();
        $users = User::all();

        if ($categories->isEmpty() || $suppliers->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Please run CategorySeeder, SupplierSeeder, and UserSeeder first!');
            return;
        }

        $products = [
            // Food & Beverages
            [
                
                'name' => 'Indomie Goreng',
                'category' => 'Food & Beverages',
                'supplier' => 'PT Indofood Sukses Makmur',
                'purchase_price' => 2500,
                'selling_price' => 3500,
                'stock' => 120,
                'unit' => 'pcs',
                'min_stock' => 30,
                'max_stock' => 200,
                'is_perishable' => true,
                'days_until_expired' => 365
            ],
            [
                'name' => 'Nescafe Classic 100g',
                'category' => 'Food & Beverages',
                'supplier' => 'PT Nestle Indonesia',
                'purchase_price' => 18000,
                'selling_price' => 25000,
                'stock' => 45,
                'unit' => 'jar',
                'min_stock' => 10,
                'max_stock' => 80,
                'is_perishable' => true,
                'days_until_expired' => 730
            ],
            [
                'name' => 'Aqua 600ml',
                'category' => 'Food & Beverages',
                'supplier' => 'PT Nestle Indonesia',
                'purchase_price' => 2000,
                'selling_price' => 3000,
                'stock' => 200,
                'unit' => 'botol',
                'min_stock' => 50,
                'max_stock' => 300,
                'is_perishable' => false
            ],
            [
                'name' => 'Beras Premium 5kg',
                'category' => 'Food & Beverages',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 55000,
                'selling_price' => 75000,
                'stock' => 30,
                'unit' => 'karung',
                'min_stock' => 10,
                'max_stock' => 50,
                'is_perishable' => false
            ],
            [
                'name' => 'Minyak Goreng Tropical 2L',
                'category' => 'Food & Beverages',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 28000,
                'selling_price' => 35000,
                'stock' => 25,
                'unit' => 'botol',
                'min_stock' => 8,
                'max_stock' => 40,
                'is_perishable' => true,
                'days_until_expired' => 540
            ],

            // Electronics
            [
                'name' => 'Smartphone Samsung Galaxy A54',
                'category' => 'Electronics',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 4500000,
                'selling_price' => 5200000,
                'stock' => 8,
                'unit' => 'unit',
                'min_stock' => 2,
                'max_stock' => 20,
                'is_perishable' => false
            ],
            [
                'name' => 'iPhone 14 128GB',
                'category' => 'Electronics',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 12000000,
                'selling_price' => 14000000,
                'stock' => 3,
                'unit' => 'unit',
                'min_stock' => 1,
                'max_stock' => 10,
                'is_perishable' => false
            ],
            [
                'name' => 'Power Bank 10000mAh',
                'category' => 'Electronics',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 150000,
                'selling_price' => 220000,
                'stock' => 15,
                'unit' => 'unit',
                'min_stock' => 5,
                'max_stock' => 30,
                'is_perishable' => false
            ],
            [
                'name' => 'Earphone Bluetooth TWS',
                'category' => 'Electronics',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 200000,
                'selling_price' => 300000,
                'stock' => 12,
                'unit' => 'unit',
                'min_stock' => 3,
                'max_stock' => 25,
                'is_perishable' => false
            ],

            // Clothing
            [
                'name' => 'Kaos Polos Cotton Combed',
                'category' => 'Clothing',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 45000,
                'selling_price' => 75000,
                'stock' => 40,
                'unit' => 'pcs',
                'min_stock' => 10,
                'max_stock' => 80,
                'is_perishable' => false
            ],
            [
                'name' => 'Celana Jeans Pria',
                'category' => 'Clothing',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 120000,
                'selling_price' => 180000,
                'stock' => 20,
                'unit' => 'pcs',
                'min_stock' => 5,
                'max_stock' => 50,
                'is_perishable' => false
            ],
            [
                'name' => 'Jaket Hoodie Unisex',
                'category' => 'Clothing',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 150000,
                'selling_price' => 230000,
                'stock' => 18,
                'unit' => 'pcs',
                'min_stock' => 5,
                'max_stock' => 35,
                'is_perishable' => false
            ],
            [
                'name' => 'Sepatu Sneakers Canvas',
                'category' => 'Clothing',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 200000,
                'selling_price' => 320000,
                'stock' => 25,
                'unit' => 'pasang',
                'min_stock' => 8,
                'max_stock' => 50,
                'is_perishable' => false
            ],

            // Health & Beauty
            [
                'name' => 'Masker Wajah Charcoal',
                'category' => 'Health & Beauty',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 35000,
                'selling_price' => 55000,
                'stock' => 25,
                'unit' => 'pcs',
                'min_stock' => 8,
                'max_stock' => 50,
                'is_perishable' => true,
                'days_until_expired' => 730
            ],
            [
                'name' => 'Shampo Anti Ketombe 200ml',
                'category' => 'Health & Beauty',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 28000,
                'selling_price' => 42000,
                'stock' => 35,
                'unit' => 'botol',
                'min_stock' => 10,
                'max_stock' => 70,
                'is_perishable' => true,
                'days_until_expired' => 1095
            ],
            [
                'name' => 'Vitamin C 1000mg',
                'category' => 'Health & Beauty',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 45000,
                'selling_price' => 68000,
                'stock' => 20,
                'unit' => 'botol',
                'min_stock' => 5,
                'max_stock' => 40,
                'is_perishable' => true,
                'days_until_expired' => 365
            ],
            [
                'name' => 'Sabun Mandi Cair 250ml',
                'category' => 'Health & Beauty',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 15000,
                'selling_price' => 22000,
                'stock' => 60,
                'unit' => 'botol',
                'min_stock' => 20,
                'max_stock' => 100,
                'is_perishable' => true,
                'days_until_expired' => 900
            ],

            // Home & Garden
            [
                'name' => 'Sapu Lidi Premium',
                'category' => 'Home & Garden',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 15000,
                'selling_price' => 25000,
                'stock' => 30,
                'unit' => 'pcs',
                'min_stock' => 8,
                'max_stock' => 60,
                'is_perishable' => false
            ],
            [
                'name' => 'Deterjen Bubuk 1kg',
                'category' => 'Home & Garden',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 18000,
                'selling_price' => 28000,
                'stock' => 45,
                'unit' => 'pcs',
                'min_stock' => 15,
                'max_stock' => 80,
                'is_perishable' => false
            ],
            [
                'name' => 'Pot Bunga Plastik Medium',
                'category' => 'Home & Garden',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 25000,
                'selling_price' => 40000,
                'stock' => 20,
                'unit' => 'pcs',
                'min_stock' => 5,
                'max_stock' => 40,
                'is_perishable' => false
            ],

            // Sports & Outdoor
            [
                'name' => 'Bola Sepak Size 5',
                'category' => 'Sports & Outdoor',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 120000,
                'selling_price' => 180000,
                'stock' => 15,
                'unit' => 'pcs',
                'min_stock' => 3,
                'max_stock' => 25,
                'is_perishable' => false
            ],
            [
                'name' => 'Raket Badminton',
                'category' => 'Sports & Outdoor',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 200000,
                'selling_price' => 300000,
                'stock' => 12,
                'unit' => 'pcs',
                'min_stock' => 3,
                'max_stock' => 20,
                'is_perishable' => false
            ],
            [
                'name' => 'Matras Yoga',
                'category' => 'Sports & Outdoor',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 85000,
                'selling_price' => 130000,
                'stock' => 20,
                'unit' => 'pcs',
                'min_stock' => 5,
                'max_stock' => 30,
                'is_perishable' => false
            ],

            // Books & Stationery
            [
                'name' => 'Buku Tulis A4 100 Lembar',
                'category' => 'Books & Stationery',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 8000,
                'selling_price' => 15000,
                'stock' => 60,
                'unit' => 'buku',
                'min_stock' => 20,
                'max_stock' => 100,
                'is_perishable' => false
            ],
            [
                'name' => 'Novel Laskar Pelangi',
                'category' => 'Books & Stationery',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 65000,
                'selling_price' => 95000,
                'stock' => 15,
                'unit' => 'buku',
                'min_stock' => 3,
                'max_stock' => 30,
                'is_perishable' => false
            ],
            [
                'name' => 'Pensil 2B Staedtler',
                'category' => 'Books & Stationery',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 3000,
                'selling_price' => 6000,
                'stock' => 100,
                'unit' => 'pcs',
                'min_stock' => 25,
                'max_stock' => 200,
                'is_perishable' => false
            ],
            [
                'name' => 'Kamus Bahasa Inggris-Indonesia',
                'category' => 'Books & Stationery',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 85000,
                'selling_price' => 120000,
                'stock' => 10,
                'unit' => 'buku',
                'min_stock' => 2,
                'max_stock' => 20,
                'is_perishable' => false
            ],

            // Others
            [
                'name' => 'Payung Lipat',
                'category' => 'Others',
                'supplier' => 'Toko Grosir Harapan',
                'purchase_price' => 35000,
                'selling_price' => 55000,
                'stock' => 25,
                'unit' => 'pcs',
                'min_stock' => 8,
                'max_stock' => 40,
                'is_perishable' => false
            ],
            [
                'name' => 'Tas Belanja Eco Friendly',
                'category' => 'Others',
                'supplier' => 'CV Sumber Rejeki',
                'purchase_price' => 15000,
                'selling_price' => 25000,
                'stock' => 40,
                'unit' => 'pcs',
                'min_stock' => 10,
                'max_stock' => 60,
                'is_perishable' => false
            ],

            // Low Stock Items (for testing)
            [
                'name' => 'Roti Tawar Sari Roti',
                'category' => 'Food & Beverages',
                'supplier' => 'PT Indofood Sukses Makmur',
                'purchase_price' => 12000,
                'selling_price' => 18000,
                'stock' => 2, // Low stock
                'unit' => 'bungkus',
                'min_stock' => 10,
                'max_stock' => 30,
                'is_perishable' => true,
                'days_until_expired' => 3
            ],
            [
                'name' => 'Baterai AA Alkaline',
                'category' => 'Electronics',
                'supplier' => 'UD Maju Bersama',
                'purchase_price' => 8000,
                'selling_price' => 15000,
                'stock' => 1, // Very low stock
                'unit' => 'pcs',
                'min_stock' => 20,
                'max_stock' => 100,
                'is_perishable' => false
            ]
        ];

        foreach ($products as $productData) {
            // Find category and supplier
            $category = $categories->where('name', $productData['category'])->first();
            $supplier = $suppliers->where('name', $productData['supplier'])->first();
            $user = $users->random();

            // Generate SKU
            $categoryCode = strtoupper(substr($productData['category'], 0, 3));
            $randomCode = strtoupper(Str::random(6));
            $sku = $categoryCode . '-' . $randomCode;

            // Calculate expired date
            $expiredDate = null;
            if ($productData['is_perishable'] && isset($productData['days_until_expired'])) {
                $expiredDate = now()->addDays($productData['days_until_expired']);
            }

            $product = Product::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'supplier_id' => $supplier->id,
                'name' => $productData['name'],
                'sku' => $sku,
                'purchase_price' => $productData['purchase_price'],
                'selling_price' => $productData['selling_price'],
                'stock' => $productData['stock'],
                'unit' => $productData['unit'],
                'min_stock' => $productData['min_stock'],
                'max_stock' => $productData['max_stock'],
                'is_perishable' => $productData['is_perishable'],
                'expired_date' => $expiredDate,
                'is_active' => true,
                'created_at' => now()->subDays(rand(1, 30)), // Random creation date within last 30 days
                'updated_at' => now()->subDays(rand(0, 7)), // Random update date within last 7 days
            ]);

            // Create initial stock movement if updateStock method exists
            if (method_exists($product, 'updateStock')) {
                $product->updateStock(0, 'initial', null, null, 'Initial stock entry from seeder');
            }
        }

        $this->command->info('Products seeded successfully!');
        $this->command->info('Created ' . count($products) . ' products with realistic data.');
        $this->command->warn('Some products have low stock for testing purposes.');
    }
}
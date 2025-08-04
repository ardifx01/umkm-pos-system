<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouse = User::where('email', 'gudang@postoko.com')->first();
        $suppliers = Supplier::all();
        
        // Create purchases for last 60 days
        for ($i = 59; $i >= 0; $i -= rand(3, 7)) { // Purchase every 3-7 days
            $purchaseDate = Carbon::now()->subDays($i);
            $supplier = $suppliers->random();
            
            $purchase = Purchase::create([
                'invoice_number' => 'PO-' . $purchaseDate->format('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'supplier_id' => $supplier->id,
                'user_id' => $warehouse->id,
                'purchase_date' => $purchaseDate,
                'total_amount' => 0, // Will be calculated
                'status' => 'received',
                'notes' => 'Purchase order from ' . $supplier->name,
            ]);

            // Add purchase items from same supplier
            $supplierProducts = Product::where('supplier_id', $supplier->id)->get();
            if ($supplierProducts->count() > 0) {
                $numItems = rand(2, min(5, $supplierProducts->count()));
                $totalAmount = 0;
                
                $selectedProducts = $supplierProducts->random($numItems);
                
                foreach ($selectedProducts as $product) {
                    $quantity = rand(10, 50);
                    $unitCost = $product->purchase_price;
                    $totalCost = $unitCost * $quantity;
                    
                    PurchaseItem::create([
                        'purchase_id' => $purchase->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_cost' => $unitCost,
                        'total_cost' => $totalCost,
                        'expired_date' => $product->is_perishable ? Carbon::now()->addMonths(rand(3, 12)) : null,
                    ]);
                    
                    $totalAmount += $totalCost;
                    
                    // Update product stock
                    $product->updateStock($quantity, 'in', 'purchase', $purchase->id, "Purchase {$purchase->invoice_number}");
                }
                
                $purchase->update(['total_amount' => $totalAmount]);
            }
        }
    }
}
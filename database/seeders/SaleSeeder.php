<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use Carbon\Carbon;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::where('email', 'kasir@postoko.com')->first();
        $products = Product::all();
        $customers = Customer::all();
        
        // Create sales for last 30 days
        for ($i = 29; $i >= 0; $i--) {
            $saleDate = Carbon::now()->subDays($i);
            $numSales = rand(5, 15); // 5-15 sales per day
            
            for ($j = 0; $j < $numSales; $j++) {
                $sale = Sale::create([
                    'invoice_number' => 'INV-' . $saleDate->format('Ymd') . '-' . str_pad(($j + 1), 4, '0', STR_PAD_LEFT),
                    'user_id' => $cashier->id,
                    'sale_date' => $saleDate->addMinutes(rand(480, 1200)), // Random time between 8 AM - 8 PM
                    'subtotal' => 0, // Will be calculated
                    'tax_amount' => 0,
                    'discount_amount' => rand(0, 10000),
                    'total' => 0, // Will be calculated
                    'cash_received' => 0, // Will be calculated
                    'change_returned' => 0, // Will be calculated
                    'customer_id' => rand(1, 10) == 1 ? $customers->random()->id : null, // 10% chance of having customer
                    'payment_method' => collect(['cash', 'card', 'digital'])->random(),
                    'status' => 'completed',
                    'order_type' => collect(['dine-in', 'takeaway', 'delivery'])->random(),
                    'completed_at' => $saleDate,
                ]);

                // Add random sale items
                $numItems = rand(1, 5);
                $subtotal = 0;
                
                for ($k = 0; $k < $numItems; $k++) {
                    $product = $products->random();
                    $quantity = rand(1, 3);
                    $itemSubtotal = $product->selling_price * $quantity;
                    
                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'quantity' => $quantity,
                        'unit_price' => $product->selling_price,
                        'discount_amount' => 0,
                        'subtotal' => $itemSubtotal,
                    ]);
                    
                    $subtotal += $itemSubtotal;
                    
                    // Update product stock
                    $product->updateStock(-$quantity, 'out', 'sale', $sale->id, "Sale {$sale->invoice_number}");
                }
                
                // Update sale totals
                $total = $subtotal - $sale->discount_amount;
                $cashReceived = $sale->payment_method == 'cash' ? $total + rand(0, 50000) : $total;
                
                $sale->update([
                    'subtotal' => $subtotal,
                    'total' => $total,
                    'cash_received' => $cashReceived,
                    'change_returned' => max(0, $cashReceived - $total),
                ]);
            }
        }
    }
}
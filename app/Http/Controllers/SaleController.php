<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['user', 'customer']);

        if ($request->search) {
            $query->where('invoice_number', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->date_from) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        $sales = $query->latest()->paginate(10);

        return Inertia::render('Sales/Index', compact('sales'));
    }

    public function create()
    {
        $products = Product::active()->with('category')->get();
        $customers = Customer::active()->get();

        return Inertia::render('Sales/Create', compact('products', 'customers'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'payment_method' => 'required|in:cash,card,transfer',
            'order_type' => 'required|in:dine_in,takeaway,delivery',
            'table_number' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'cash_received' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // Create sale
            $sale = Sale::create([
                'invoice_number' => Sale::generateInvoiceNumber(),
                'user_id' => auth()->id(),
                'sale_date' => now(),
                'customer_id' => $request->customer_id,
                'payment_method' => $request->payment_method,
                'order_type' => $request->order_type,
                'table_number' => $request->table_number,
                'tax_amount' => $request->tax_amount ?? 0,
                'discount_amount' => $request->discount_amount ?? 0,
                'cash_received' => $request->cash_received ?? 0,
                'note' => $request->note,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Create sale items and update stock
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                // Check stock availability
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                // Create sale item
                $saleItem = $sale->saleItems()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_amount' => $item['discount_amount'] ?? 0,
                    'notes' => $item['notes'] ?? null,
                ]);

                $saleItem->calculateSubtotal();

                // Update product stock
                $product->updateStock(
                    -$item['quantity'], 
                    'out', 
                    'sale', 
                    $sale->id,
                    "Sold via invoice {$sale->invoice_number}"
                );
            }

            // Calculate sale totals
            $sale->calculateTotals();

            // Update customer stats if customer exists
            if ($sale->customer_id) {
                $sale->customer->updateStats();
            }
        });

        return redirect()->route('sales.index')
            ->with('success', 'Sale completed successfully.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['user', 'customer', 'saleItems.product']);
        
        return Inertia::render('Sales/Show', compact('sale'));
    }

    public function edit(Sale $sale)
    {
        if ($sale->status === 'completed') {
            return back()->withErrors(['error' => 'Cannot edit completed sale.']);
        }

        $sale->load(['saleItems.product']);
        $products = Product::active()->with('category')->get();
        $customers = Customer::active()->get();

        return Inertia::render('Sales/Edit', compact('sale', 'products', 'customers'));
    }

    public function destroy(Sale $sale)
    {
        if ($sale->status === 'completed') {
            return back()->withErrors(['error' => 'Cannot delete completed sale.']);
        }

        DB::transaction(function () use ($sale) {
            // Restore stock for each item
            foreach ($sale->saleItems as $item) {
                $item->product->updateStock(
                    $item->quantity,
                    'in',
                    'sale_cancelled',
                    $sale->id,
                    "Stock restored from cancelled sale {$sale->invoice_number}"
                );
            }

            $sale->delete();
        });

        return redirect()->route('sales.index')
            ->with('success', 'Sale deleted successfully.');
    }
}
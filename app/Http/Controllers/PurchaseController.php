<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'user']);

        if ($request->search) {
            $query->where('invoice_number', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $purchases = $query->latest()->paginate(10);
        $suppliers = Supplier::active()->get(['id', 'name']);

        return Inertia::render('Purchases/Index', compact('purchases', 'suppliers'));
    }

    public function create()
    {
        $suppliers = Supplier::active()->get();
        $products = Product::active()->get(['id', 'name', 'sku', 'purchase_price']);

        return Inertia::render('Purchases/Create', compact('suppliers', 'products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.expired_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // Create purchase
            $purchase = Purchase::create([
                'invoice_number' => Purchase::generateInvoiceNumber(),
                'supplier_id' => $request->supplier_id,
                'user_id' => auth()->id(),
                'purchase_date' => $request->purchase_date,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Create purchase items
            foreach ($request->items as $item) {
                $purchaseItem = $purchase->purchaseItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'expired_date' => $item['expired_date'] ?? null,
                ]);

                $purchaseItem->calculateTotal();
            }

            // Calculate purchase total
            $purchase->calculateTotal();
        });

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase order created successfully.');
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'user', 'purchaseItems.product']);
        
        return Inertia::render('Purchases/Show', compact('purchase'));
    }

    public function edit(Purchase $purchase)
    {
        if ($purchase->status === 'received') {
            return back()->withErrors(['error' => 'Cannot edit received purchase.']);
        }

        $purchase->load(['purchaseItems.product']);
        $suppliers = Supplier::active()->get();
        $products = Product::active()->get(['id', 'name', 'sku', 'purchase_price']);

        return Inertia::render('Purchases/Edit', compact('purchase', 'suppliers', 'products'));
    }

    public function update(Request $request, Purchase $purchase)
    {
        if ($purchase->status === 'received') {
            return back()->withErrors(['error' => 'Cannot edit received purchase.']);
        }

        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.expired_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $purchase) {
            // Update purchase
            $purchase->update([
                'supplier_id' => $request->supplier_id,
                'purchase_date' => $request->purchase_date,
                'notes' => $request->notes,
            ]);

            // Delete existing items and recreate
            $purchase->purchaseItems()->delete();

            foreach ($request->items as $item) {
                $purchaseItem = $purchase->purchaseItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'expired_date' => $item['expired_date'] ?? null,
                ]);

                $purchaseItem->calculateTotal();
            }

            // Recalculate total
            $purchase->calculateTotal();
        });

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase updated successfully.');
    }

    public function destroy(Purchase $purchase)
    {
        if ($purchase->status === 'received') {
            return back()->withErrors(['error' => 'Cannot delete received purchase.']);
        }

        $purchase->delete();

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase deleted successfully.');
    }

    public function receive(Purchase $purchase)
    {
        if ($purchase->status !== 'pending') {
            return back()->withErrors(['error' => 'Purchase is not in pending status.']);
        }

        if ($purchase->receive()) {
            return back()->with('success', 'Purchase received successfully. Stock has been updated.');
        }

        return back()->withErrors(['error' => 'Failed to receive purchase.']);
    }
}
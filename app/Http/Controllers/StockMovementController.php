<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        // Validasi input
        $request->validate([
            'search' => 'nullable|string|max:255',
            'type' => 'nullable|in:in,out,adjustment',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $query = StockMovement::with(['product:id,name,sku', 'user:id,name']);

        // Apply search filter
        if ($request->filled('search')) {
            $query->whereHas('product', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        // Apply type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Apply date filters
        if ($request->filled('date_from')) {
            $query->whereDate('movement_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('movement_date', '<=', $request->date_to);
        }

        $movements = $query->latest('movement_date')
            ->paginate(15)
            ->withQueryString();

        $types = StockMovement::select('type')
            ->distinct()
            ->orderBy('type')
            ->pluck('type');

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'types' => $types,
            'filters' => $request->only(['search', 'type', 'date_from', 'date_to'])
        ]);
    }

    public function create()
    {
        // Get all products with their current stock
        $products = Product::select(['id', 'name', 'sku', 'stock', 'unit'])
            ->orderBy('name')
            ->get();

        // Movement types
        $types = [
            'in' => 'Stock In',
            'out' => 'Stock Out', 
            'adjustment' => 'Stock Adjustment'
        ];

        return Inertia::render('StockMovements/Create', [
            'products' => $products,
            'types' => $types
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $product = Product::lockForUpdate()->findOrFail($validatedData['product_id']);
            
            // Calculate actual quantity based on type
            $actualQuantity = $this->calculateActualQuantity($validatedData['type'], $validatedData['quantity']);
            
            // Check stock for 'out' movements
            if ($validatedData['type'] === 'out' && ($product->stock + $actualQuantity) < 0) {
                DB::rollBack();
                return back()->withErrors([
                    'quantity' => "Stock tidak cukup. Stok tersedia: {$product->stock}, diminta: {$validatedData['quantity']}"
                ]);
            }

            $stockBefore = $product->stock;
            $stockAfter = $stockBefore + $actualQuantity;

            // Create stock movement
            StockMovement::create([
                'product_id' => $validatedData['product_id'],
                'user_id' => auth()->id(),
                'type' => $validatedData['type'],
                'quantity' => $actualQuantity,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'notes' => $validatedData['notes'],
                'movement_date' => now(),
                'reference_type' => 'manual',
                'user_role' => auth()->user()->getRoleNames()->first(),
            ]);

            // Update product stock
            $product->update(['stock' => $stockAfter]);

            DB::commit();

            return back()->with('success', 'Pergerakan stock berhasil dicatat.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Stock movement creation failed', [
                'user_id' => auth()->id(),
                'request_data' => $validatedData,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['general' => 'Gagal mencatat pergerakan stock. Silakan coba lagi.']);
        }
    }

    public function update(Request $request, StockMovement $stockMovement)
    {
        $validatedData = $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            // Hanya notes yang bisa diupdate untuk menjaga integritas data stock
            $stockMovement->update([
                'notes' => $validatedData['notes']
            ]);

            return back()->with('success', 'Catatan pergerakan stock berhasil diperbarui.');

        } catch (\Exception $e) {
            \Log::error('Stock movement update failed', [
                'user_id' => auth()->id(),
                'movement_id' => $stockMovement->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['general' => 'Gagal memperbarui catatan. Silakan coba lagi.']);
        }
    }

    public function destroy(StockMovement $stockMovement)
    {
        try {
            DB::beginTransaction();

            $product = Product::lockForUpdate()->findOrFail($stockMovement->product_id);

            // Reverse the stock movement
            $reversedQuantity = -$stockMovement->quantity;
            $newStock = $product->stock + $reversedQuantity;

            // Check if reversing this movement would cause negative stock
            if ($newStock < 0) {
                DB::rollBack();
                return back()->withErrors([
                    'general' => "Tidak dapat menghapus movement ini karena akan menyebabkan stock negatif. Stock saat ini: {$product->stock}"
                ]);
            }

            // Update product stock
            $product->update(['stock' => $newStock]);

            // Delete the stock movement
            $stockMovement->delete();

            DB::commit();

            return back()->with('success', 'Pergerakan stock berhasil dihapus dan stock produk telah disesuaikan.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Stock movement deletion failed', [
                'user_id' => auth()->id(),
                'movement_id' => $stockMovement->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['general' => 'Gagal menghapus pergerakan stock. Silakan coba lagi.']);
        }
    }

    public function show(StockMovement $stockMovement)
    {
        $stockMovement->load(['product:id,name,sku', 'user:id,name']);

        return Inertia::render('StockMovements/Show', [
            'movement' => $stockMovement
        ]);
    }

    private function calculateActualQuantity(string $type, int $quantity): int
    {
        return match($type) {
            'in' => abs($quantity),
            'out' => -abs($quantity),
            'adjustment' => $quantity, // bisa positif atau negatif
            default => throw new \InvalidArgumentException("Tipe movement tidak valid: {$type}")
        };
    }
}
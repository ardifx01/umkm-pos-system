<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'user']);

        if ($request->search) {
            $query->whereHas('product', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->date_from) {
            $query->whereDate('movement_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('movement_date', '<=', $request->date_to);
        }

        $movements = $query->latest()->paginate(15);

        $types = StockMovement::select('type')->distinct()->pluck('type');

        return Inertia::render('StockMovements/Index', compact('movements', 'types'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer',
            'notes' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // For 'out' movements, make quantity negative
        $quantity = $request->type === 'out' ? -abs($request->quantity) : $request->quantity;
        
        $product->updateStock(
            $quantity,
            $request->type,
            'manual',
            null,
            $request->notes
        );

        return back()->with('success', 'Stock movement recorded successfully.');
    }
}
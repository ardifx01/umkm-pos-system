<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->low_stock) {
            $query->lowStock();
        }

        $products = $query->latest()->paginate(10);
        $categories = Category::active()->get();

        return Inertia::render('Products/Index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::active()->get();
        $suppliers = Supplier::active()->get();

        return Inertia::render('Products/Create', compact('categories', 'suppliers'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'min_stock' => 'nullable|integer|min:0',
            'max_stock' => 'nullable|integer|min:0',
            'is_perishable' => 'boolean',
            'expired_date' => 'nullable|date|after:today',
        ]);

        $product = Product::create([
            'user_id' => auth()->id(),
            ...$request->all(),
            'is_active' => true,
        ]);

        // Create initial stock movement
        $product->updateStock(0, 'initial', null, null, 'Initial stock entry');

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $product->load(['category', 'supplier', 'stockMovements.user']);
        
        return Inertia::render('Products/Show', compact('product'));
    }

    public function edit(Product $product)
    {
        $categories = Category::active()->get();
        $suppliers = Supplier::active()->get();

        return Inertia::render('Products/Edit', compact('product', 'categories', 'suppliers'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'min_stock' => 'nullable|integer|min:0',
            'max_stock' => 'nullable|integer|min:0',
            'is_perishable' => 'boolean',
            'expired_date' => 'nullable|date|after:today',
        ]);

        $oldStock = $product->stock;
        $product->update($request->all());

        // Track stock changes
        if ($oldStock != $request->stock) {
            $difference = $request->stock - $oldStock;
            $product->updateStock($difference, 'adjustment', null, null, 'Stock adjusted via product edit');
        }

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}

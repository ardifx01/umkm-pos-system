<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function show(Request $request, $type)
    {
        switch ($type) {
            case 'sales':
                return $this->salesReport($request);
            case 'products':
                return $this->productsReport($request);
            case 'stock':
                return $this->stockReport($request);
            default:
                abort(404);
        }
    }

    private function salesReport(Request $request)
    {
        $dateFrom = $request->date_from ? Carbon::parse($request->date_from) : now()->startOfMonth();
        $dateTo = $request->date_to ? Carbon::parse($request->date_to) : now()->endOfMonth();

        $sales = Sale::with(['user', 'customer'])
            ->whereBetween('sale_date', [$dateFrom, $dateTo])
            ->completed()
            ->get();

        $summary = [
            'total_sales' => $sales->sum('total'),
            'total_transactions' => $sales->count(),
            'average_transaction' => $sales->count() > 0 ? $sales->sum('total') / $sales->count() : 0,
            'total_tax' => $sales->sum('tax_amount'),
            'total_discount' => $sales->sum('discount_amount'),
        ];

        return Inertia::render('Reports/Sales', compact('sales', 'summary', 'dateFrom', 'dateTo'));
    }

    private function productsReport(Request $request)
    {
        $products = Product::with(['category', 'saleItems' => function($query) use ($request) {
            if ($request->date_from) {
                $query->whereHas('sale', function($q) use ($request) {
                    $q->whereBetween('sale_date', [
                        $request->date_from, 
                        $request->date_to ?? now()
                    ]);
                });
            }
        }])->get();

        $products = $products->map(function($product) {
            $soldQuantity = $product->saleItems->sum('quantity');
            $soldAmount = $product->saleItems->sum('subtotal');
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category->name ?? '-',
                'current_stock' => $product->stock,
                'sold_quantity' => $soldQuantity,
                'sold_amount' => $soldAmount,
                'selling_price' => $product->selling_price,
                'is_low_stock' => $product->is_low_stock,
            ];
        });

        return Inertia::render('Reports/Products', compact('products'));
    }

    private function stockReport(Request $request)
    {
        $movements = StockMovement::with(['product', 'user'])
            ->when($request->date_from, function($query) use ($request) {
                return $query->whereBetween('movement_date', [
                    $request->date_from,
                    $request->date_to ?? now()
                ]);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Reports/Stock', compact('movements'));
    }
}
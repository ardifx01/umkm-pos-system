<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Category;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // Statistics for dashboard
        $stats = [
            'total_products' => Product::active()->count(),
            'low_stock_products' => Product::lowStock()->count(),
            'total_sales_today' => Sale::today()->completed()->sum('total'),
            'total_customers' => Customer::active()->count(),
            'total_categories' => Category::active()->count(),
        ];

        // Recent sales
        $recent_sales = Sale::with(['user', 'customer'])
            ->latest()
            ->take(5)
            ->get();

        // Low stock products
        $low_stock_products = Product::with(['category'])
            ->lowStock()
            ->take(5)
            ->get();

        // Expiring products
        $expiring_products = Product::with(['category'])
            ->expiringSoon()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', compact(
            'stats', 
            'recent_sales', 
            'low_stock_products', 
            'expiring_products'
        ));
    }
}
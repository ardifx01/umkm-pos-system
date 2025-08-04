<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Basic Product Management (available to all authenticated users)
    Route::resource('products', ProductController::class);
    
    // Categories (available to all authenticated users)
    Route::resource('categories', CategoryController::class);
    
    // Sales/POS (available to all authenticated users)
    Route::resource('sales', SaleController::class);
    Route::post('/sales/{sale}/refund', [SaleController::class, 'refund'])->name('sales.refund');
    Route::post('/sales/{sale}/void', [SaleController::class, 'void'])->name('sales.void');
    
    // Basic Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{type}', [ReportController::class, 'show'])->name('reports.show');
});

/*
|--------------------------------------------------------------------------
| Manager/Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // User Management
    Route::resource('users', UserController::class);
    
    // Role Management
    Route::resource('roles', RoleController::class);
    
    // Supplier Management
    Route::resource('suppliers', SupplierController::class);
    
    // Purchase Management
    Route::resource('purchases', PurchaseController::class);
    Route::post('/purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');
    
    // Customer Management
    Route::resource('customers', CustomerController::class);
    
    // Stock Management
    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::post('/stock-movements', [StockMovementController::class, 'store'])->name('stock-movements.store');
    Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');
    
    // Advanced Reports
    Route::get('/reports/export/{type}', [ReportController::class, 'export'])->name('reports.export');
});

/*
|--------------------------------------------------------------------------
| API Routes for POS
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('api')->group(function () {
    // Product Search for POS
    Route::get('/products/search', [ProductController::class, 'search'])->name('api.products.search');
    Route::get('/products/{product}/barcode', [ProductController::class, 'findByBarcode'])->name('api.products.barcode');
    
    // Customer Search for POS
    Route::get('/customers/search', [CustomerController::class, 'search'])->name('api.customers.search');
    
    // Real-time Stock Check
    Route::get('/products/{product}/stock', [ProductController::class, 'checkStock'])->name('api.products.stock');
    
    // Quick Sale
    Route::post('/sales/quick', [SaleController::class, 'quickSale'])->name('api.sales.quick');
});

require __DIR__.'/auth.php';
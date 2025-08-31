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
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\TaxController;
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
    
    // Static routes first
    Route::get('stock-movements', [StockMovementController::class, 'index'])
        ->name('stock-movements.index')
        ->middleware('permission:view stock movements');
    
    Route::get('stock-movements/create', [StockMovementController::class, 'create'])
        ->name('stock-movements.create')
        ->middleware('permission:create stock movements');
    
    Route::post('stock-movements', [StockMovementController::class, 'store'])
        ->name('stock-movements.store')
        ->middleware('permission:create stock movements'); // Ganti ke 'create'
    
    // Parameterized routes last
    Route::get('stock-movements/{stockMovement}', [StockMovementController::class, 'show'])
        ->name('stock-movements.show')
        ->middleware('permission:view stock movements');
    
    Route::get('stock-movements/{stockMovement}/edit', [StockMovementController::class, 'edit'])
        ->name('stock-movements.edit')
        ->middleware('permission:edit stock movements');
    
    Route::put('stock-movements/{stockMovement}', [StockMovementController::class, 'update'])
        ->name('stock-movements.update')
        ->middleware('permission:edit stock movements');
    
    Route::delete('stock-movements/{stockMovement}', [StockMovementController::class, 'destroy'])
        ->name('stock-movements.destroy')
        ->middleware('permission:delete stock movements');

    // Static routes first
    Route::get('taxes', [TaxController::class, 'index'])
        ->name('taxes.index')
        ->middleware('permission:view taxes');
    
    Route::get('taxes/create', [TaxController::class, 'create'])
        ->name('taxes.create')
        ->middleware('permission:create taxes');
    
    Route::post('taxes', [TaxController::class, 'store'])
        ->name('taxes.store')
        ->middleware('permission:create taxes');
    
    // Additional utility routes
    Route::get('taxes/active', [TaxController::class, 'getActiveTaxes'])
        ->name('taxes.active')
        ->middleware('permission:view taxes');
    
    Route::post('taxes/{tax}/calculate', [TaxController::class, 'calculateTax'])
        ->name('taxes.calculate')
        ->middleware('permission:view taxes');
    
    Route::post('taxes/{tax}/toggle-status', [TaxController::class, 'toggleStatus'])
        ->name('taxes.toggle-status')
        ->middleware('permission:edit taxes');
    
    Route::post('taxes/{id}/restore', [TaxController::class, 'restore'])
        ->name('taxes.restore')
        ->middleware('permission:restore taxes');
    
    // Parameterized routes last
    Route::get('taxes/{tax}', [TaxController::class, 'show'])
        ->name('taxes.show')
        ->middleware('permission:view taxes');
    
    Route::get('taxes/{tax}/edit', [TaxController::class, 'edit'])
        ->name('taxes.edit')
        ->middleware('permission:edit taxes');
    
    Route::put('taxes/{tax}', [TaxController::class, 'update'])
        ->name('taxes.update')
        ->middleware('permission:edit taxes');
    
    Route::delete('taxes/{tax}', [TaxController::class, 'destroy'])
        ->name('taxes.destroy')
        ->middleware('permission:delete taxes');

    Route::resource('payment-methods', PaymentMethodController::class);
    Route::patch('payment-methods/{paymentMethod}/toggle-status', [PaymentMethodController::class, 'toggleStatus'])->name('payment-methods.toggle-status');
    Route::patch('payment-methods/update-order', [PaymentMethodController::class, 'updateOrder'])->name('payment-methods.update-order');
    
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
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'sku',
        'purchase_price',
        'selling_price',
        'stock',
        'unit',
        'description',
        'is_active',
        'category_id',
        'supplier_id',
        'image',
        'min_stock',
        'max_stock',
        'is_perishable',
        'expired_date',
        'preparation_time',
        'weight'
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'weight' => 'decimal:3',
        'is_active' => 'boolean',
        'is_perishable' => 'boolean',
        'expired_date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'min_stock');
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->where('is_perishable', true)
                    ->whereDate('expired_date', '<=', now()->addDays($days));
    }

    // Accessors
    public function getProfitMarginAttribute()
    {
        if ($this->purchase_price > 0) {
            return (($this->selling_price - $this->purchase_price) / $this->purchase_price) * 100;
        }
        return 0;
    }

    public function getIsLowStockAttribute()
    {
        return $this->stock <= $this->min_stock;
    }

    public function getIsExpiredAttribute()
    {
        if (!$this->is_perishable || !$this->expired_date) {
            return false;
        }
        return $this->expired_date < now();
    }

    // Methods
    public function updateStock($quantity, $type = 'adjustment', $reference_type = null, $reference_id = null, $notes = null)
    {
        $oldStock = $this->stock;
        $this->stock += $quantity;
        $this->save();

        // Create stock movement record
        StockMovement::create([
            'product_id' => $this->id,
            'user_id' => auth()->id(),
            'type' => $type,
            'quantity' => $quantity,
            'stock_before' => $oldStock,
            'stock_after' => $this->stock,
            'reference_type' => $reference_type,
            'reference_id' => $reference_id,
            'notes' => $notes,
            'movement_date' => now(),
            'user_role' => auth()->user()?->getRoleNames()->first(),
            'user_permissions' => auth()->user()?->getPermissionsViaRoles()->pluck('name')->toArray(),
        ]);

        return $this;
    }
}
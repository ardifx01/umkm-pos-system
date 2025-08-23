<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'sku',
        'barcode',
        'purchase_price',
        'selling_price',
        'stock',
        'unit',
        'description',
        'category_id',
        'supplier_id',
        'tax_id',
        'image',
        'min_stock',
        'max_stock',
        'is_perishable',
        'expired_date',
        'preparation_time',
        'weight',
        'track_stock',
        'allow_negative_stock',
        'markup_percentage',
        'is_active'
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'weight' => 'decimal:3',
        'markup_percentage' => 'decimal:2',
        'is_perishable' => 'boolean',
        'track_stock' => 'boolean',
        'allow_negative_stock' => 'boolean',
        'is_active' => 'boolean',
        'expired_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Add this accessor to get full URL for image
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // If image path already contains http/https, return as is
            if (str_starts_with($this->image, 'http')) {
                return $this->image;
            }
            
            // Return full URL for storage path
            return Storage::disk('public')->url($this->image);
        }
        
        return null;
    }

    // Append the image_url to JSON output
    protected $appends = ['image_url'];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Scopes
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'min_stock');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Custom methods
    public function updateStock($quantity, $type, $reference_id = null, $reference_type = null, $notes = null)
    {
        // Update stock
        $this->increment('stock', $quantity);
        
        // Create stock movement record
        $this->stockMovements()->create([
            'user_id' => auth()->id(),
            'type' => $type,
            'quantity' => $quantity,
            'stock_before' => $this->stock - $quantity,
            'stock_after' => $this->stock,
            'reference_type' => $reference_type, // Ubah dari sale_id/purchase_id
            'reference_id' => $reference_id,     // Ubah dari sale_id/purchase_id
            'notes' => $notes,
            'movement_date' => now(), // Tambahkan ini karena ada di migration
        ]);
    }

    public function scopeExpiringSoon($query, $days = 7)
    {
        return $query->whereNotNull('expired_date')
            ->where('expired_date', '<=', now()->addDays($days));
    }


    public function isLowStock()
    {
        return $this->min_stock && $this->stock <= $this->min_stock;
    }
}
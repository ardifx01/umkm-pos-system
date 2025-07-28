<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

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
    ];

    // Relasi ke user (pemilik/penjual)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function saleItems() {
        return $this->hasMany(SaleItem::class);
    }

    public function sales()
    {
        return $this->hasManyThrough(Sale::class, SaleItem::class);
    }
}
